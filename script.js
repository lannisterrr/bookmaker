const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// array of object for the two name value pairs
let bookmarks = [];

// Show Modal , Focus on the first Input - 1

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Build bookmarks DOM

function buildBookmarks(){
    // remove all bookmarks elements
    bookmarksContainer.textContent = '';
    // build items
    bookmarks.forEach((bookmark) => {
        const{name , url} = bookmark;
        // console.log(name , url);

        // item
        const item = document.createElement('div');
        item.classList.add('item');

        // close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-trash-alt');
        closeIcon.setAttribute('title','Delete Bookmarks');
        closeIcon.setAttribute('onClick',`deleteBookmark('${url}')`);

        //favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');

        // link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Append to our Bookmarks container , first smaller things than bigger things
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);

    });
}


// Fetch our bookmarks

function fetchBookmarks(){
    // get bookmarks from local if available

    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        // Create a bookmarks array in local , the dumy one for the user
        bookmarks = [
            {
                name: 'taxet tech',
                url : 'https://taxet.tech',
            },
        ];
       localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}


// Delete Bookmark

function deleteBookmark(url){
    //The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.

    bookmarks.forEach((bookmark, i)=> {
        if(bookmark.url === url){
            bookmarks.splice(i,1); // at the given index delete one item
        }
    });

    // update bookmarks array again after removing and re-populate the dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


// handle data from form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if(!urlValue.includes('http://' , 'https://')){
        urlValue = `https://${urlValue}`;
    }
   
    // if validate function return false , this function will also return false

    if(!validate(nameValue , urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url : urlValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}


// Modal Event Listener 1

modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',() => modal.classList.remove('show-modal'));


// validate form   
function validate(nameValue , urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

    const regex = new RegExp(expression)

    if(!nameValue || !urlValue){
        alert('fill both fields');
        return false;
    }


    if(!urlValue.match(regex)){
        alert('please provide a valid web address');
        return false;
    }
// if the code doesn't run into any if statement than return true
    return true;
}


// only when we click on the overlay , we want to dismiss the modal
window.addEventListener('click',(e) => (e.target===modal) ? modal.classList.remove('show-modal') : false );

bookmarkForm.addEventListener('submit',storeBookmark);


// On Load , fetch Bookmarks
fetchBookmarks();