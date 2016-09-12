import express, { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = new Router();

fs
  .readdirSync(path.join('server', 'routes'))
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach(file => {
    const routeName = file.substring(0, file.length - 3);
    // eslint-disable-next-line global-require
    const route = require(path.resolve(__dirname, file)).default;
    router.use(`/api/v1/${routeName}`, route);
  });

router.use('/static', express.static(path.join(__dirname, '..', 'static')));

router.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'styles', 'styles.css'));
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

export default router;
