const fs = require('fs');

// Defines Journal object
// id: number  // content: string // reactions: array [a,b,c] // giphy: string - points to image

let journals = 
[
    {

        id: 1,
        content: 'Test content',
        reactions: [0,0,0],
        giphy: '',
        comments: 'test comment 1'
    },
    {
        id: 2,
        content: 'Test 2',
        reactions: [2,3,1],
        giphy: '',
        comments: 'test comment 2'
    },
    {
        id: 3,
        content: 'Test 3',
        reactions: [5,4,6],
        giphy: '',
        comments: 'test comment 3'
    },
];

module.exports = journals;

