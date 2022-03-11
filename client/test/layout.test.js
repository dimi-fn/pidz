/**
 * @jest-environment jsdom
 */

/*
The comment above is required in order to fix the error 'document is not defined' when running the tests
*/

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');


describe('index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {
        test('it has a title', () => {
            const title = document.querySelector('head title');
            expect(title).toBeTruthy();
            expect(title.textContent).toBe("Journal | Nojudgies.com")
        })
    })

    describe('body', () => {
        // describe('button', () => {
        //     let button;

        //     beforeEach(() => {
        //         button = document.querySelector('button')
        //     })

        //     test('it exists', () => {
        //         expect(button).toBeTruthy();
        //     })

        //     test('it has a call to action', () => {
        //         expect(button.textContent.toLowerCase()).toContain('click')
        //     })

        // })

        describe('form', () => {
            let form;
            let typeHere, btnSubmitJournal, searchGifInput, btnFindGif;
            beforeEach(() => {
                form = document.querySelector('form')
                typeHere = form.querySelector('#contentInputBox')
                btnSubmitJournal = form.querySelector('#submitJournal');
                searchGifInput = form.querySelector('#giphytextsearch')
                btnFindGif = form.querySelector('#giphybtnsearch')
                submitBtn = form.querySelector('[type="submit"]');
            })
    
            test('it exists', () => {
                expect(form).toBeTruthy();
            });
    
            // <textarea class = "contentInputBox" id = "contentInputBox" placeholder="Type journal content here"></textarea>
            describe('input text area: contentInputBox', () => {
                test('it has an id of "contentInputBox"', () => {
                    expect(typeHere).toBeTruthy();
                })

                // test('it is a text input"', () => {
                //     expect(typeHere.getAttribute('type')).toBe('textarea')
                // })
        
                test('it has a label"', () => {
                    expect(document.querySelector('[for="contentInputBox"]')).toBeTruthy();
                })
            })

            // <input id = "testSubmitJournal" type = "submit" class="postButton" value = "Publish Entry"></
            describe('submit button for "Publish Entry"', () => {
                test('it says "Publish Entry"', () => {
                    expect(btnSubmitJournal.value).toBe('Submit Journal');
                })
            })

            // // <input id = "refreshJournals" type = "submit" value = "Refresh journals"></input>
            // describe('submit button for "Refresh journals"', () => {
            //     test('it says "Refresh journals"', () => {
            //         expect(btnRefreshJournals.value).toBe('Refresh journals');
            //     })
            // })

            // id="giphytextsearch"
            describe('input text: searchGifInput', () => {
                test('it has an id of "giphytextsearch"', () => {
                    expect(searchGifInput).toBeTruthy();
                })

                test('it is a text input"', () => {
                    expect(searchGifInput.getAttribute('type')).toBe('search')
                })
        
                test('it has a label', () => {
                    expect(document.querySelector('[for="giphytextsearch"]')).toBeTruthy();
                })
            })

            // id="giphybtnsearch"
            describe('submit button for "Find giphy"', () => {
                test('it says "Find giphy"', () => {
                    expect(btnFindGif.value).toBe('Find giphy');
                })
            })


            // <div id = "newJournalGiphyPreview" class = "NavGiphyPreview"></div>
            describe('it has div with id "newJournalGiphyPreview"', () => {
                test('it has div with id "newJournalGiphyPreview"', () => {
                    expect(document.querySelector('div#newJournalGiphyPreview')).toBeTruthy();
             })
            })
    
        })
    

        // <section id = "displayJournalsSection">
        test('it has a section to display Journals', () => {
            expect(document.querySelector('section#displayJournalsSection')).toBeTruthy();
        })
    })


})
