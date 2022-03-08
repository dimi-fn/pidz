const fs = require('fs');

// Defines Journal object
// id: number  // content: string // reactions: array [a,b,c] // giphy: string - points to image

let journals = 
[
    {

        id: 1,
        content: 'Test content',
        reactions: [4,2,5],
        giphy: ''
    },
    {
        id: 2,
        content: 'Test 2',
        reactions: [3,5,2],
        giphy: ''
    },
    {
        id: 3,
        content: 'Test 3',
        reactions: [0,1,35],
        giphy: ''
    },
];

module.exports = journals;

