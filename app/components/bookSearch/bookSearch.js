var $input = $('.book-search-input');
var $result = $('.book-search-result');

function debounce(func, wait) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function () {
            timeout = null;
            func.apply(context, args);
        };

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);
    };
};

var onInputHandler = debounce(function (e) {
    var searchTerm = e.target.value;

    if (searchTerm.length < 3) {
        return;
    };

    var URL = 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm;

    $.get(URL, function (data) {
        var searchResult = [];

        data.items.forEach(function (bookItem) {
            var info = bookItem.volumeInfo;

            var bookWrapper = $('<div/>', {
                'class': 'book',
            });

            var bookImg = $('<div/>', {
                'class': 'book__img',
            }).appendTo(bookWrapper);

            var bookDescription = $('<div/>', {
                'class': 'book__description'
            }).appendTo(bookWrapper);

            $('<img/>', {
                'class': 'book__img',
                'src': info.imageLinks && info.imageLinks.thumbnail || 'http://vyfhealth.com/wp-content/uploads/2015/10/yoga-placeholder1.jpg',
            }).appendTo(bookImg);

            $('<h2/>', {
                'class': 'book__title',
                'text': info.title,
            }).appendTo(bookDescription);

            $('<p/>', {
                'class': 'book__authors',
                'text': info.authors,
            }).appendTo(bookDescription);

            $('<p/>', {
                'class': 'book__publisher',
                'text': info.publisher,
            }).appendTo(bookDescription);

            $('<a/>', {
                'class': 'book__link',
                'href': bookItem.saleInfo.buyLink,
                'target': '_blank',
                'text': 'купить',
            }).appendTo(bookDescription);

            $('<a/>', {
                'class': 'book__desc',
                'text': info.description,
            }).appendTo(bookDescription);

            searchResult.push(bookWrapper);            
        });

        $result.html(searchResult);

        var $resultMsg = $('<p/>', {
            'class': 'result-msg',
            'text': 'По вашему запросу ' + searchTerm + ' найдено ' + searchResult.length + ' книг',
        });
        $result.before($resultMsg);
    });
}, 3000)

$input.on('keyup', onInputHandler);