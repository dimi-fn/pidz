const express = require ('express');
const router = express.Router();

router.get('/', (req,resp) =>
{
    resp.sendFile("/client/index.html", { root: '..'});
});

module.exports = router;