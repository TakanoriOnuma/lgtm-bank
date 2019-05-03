'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// 環境変数の読み込み
require('dotenv').config({ path: path.resolve(__dirname, '../env/.env') });

// cloudinaryの設定
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// タイムゾーンを設定する
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const app = express();

// CORSを許可する
app.use(cors());

// POSTパラメータをJSONで取得できるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public以下に配置したファイルは直リンクで見れるようにする
app.use(express.static(path.resolve(__dirname, 'public')));

// サーバーの動作確認
app.get('/time', (req, res) => {
  res.send(moment().format('YYYY/MM/DD HH:mm:ss'));
});

// LGTMの画像URLを取得する
app.get('/lgtm-image-urls', (req, res) => {
  const { category } = req.query;
  cloudinary.api.resources(
    {
      type: 'upload',
      prefix: `LGTM${category ? `/${category}` : ''}`,
      max_results: 100,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(400).send('error');
        return;
      }
      res.send(result.resources);
    }
  );
});

// URLの画像をローカルにダウンロードしてcloudinaryにアップロードする
app.post('/upload', (req, res) => {
  console.log(req.body);
  const { url: imgUrl, category } = req.body;
  cloudinary.uploader.upload(
    imgUrl,
    {
      folder: `LGTM/${category}`
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.send(false);
        return;
      }
      console.log(result);
      res.send(true);
    }
  );
});

// サーバーを起動する
const server = app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
});

// socketサーバーを立ち上げる
const io = require('socket.io')(server, { origins: '*:*' });

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });

  // ユーザの参加
  socket.on('send', (message) => {
    console.log('send:', message);
    io.emit('send', message);
  });
});
