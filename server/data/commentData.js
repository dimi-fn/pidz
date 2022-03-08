//defines comment
// id: number // journalId: number // content: string // reactions: array [a,b,c] // 
// giphy: obj

let comments = 
[

    {
        id: 1,
        journalId: 1,
        content: 'Test comment 1 j1',
        reactions: [0,0,0],
        giphy: ''
    },
    {
        id: 2,
        journalId: 1,
        content: 'Test comment 2 j1',
        reactions: [1,3,0],
        giphy: ''
    },
    {
        id: 3,
        journalId: 1,
        content: 'Test comment 3 j1',
        reactions: [4,2,9],
        giphy: ''
    },
    {
        id: 4,
        journalId: 2,
        content: 'Test comment 4 j2',
        reactions: [12,0,0],
        giphy: ''
    },
    {
        id: 5,
        journalId: 2,
        content: 'Test comment 5 j2',
        reactions: [4,84,0],
        giphy: ''
    },
    {
        id: 6,
        journalId: 3,
        content: 'Test comment 6 j3',
        reactions: [12,4,87],
        giphy: ''
    },
];

module.exports = comments;
