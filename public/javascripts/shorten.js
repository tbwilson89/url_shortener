/* global $ */

$('.btn-shorten').on('click', () =>{
    window.location.href = "/api/"+$('#url-field').val();
})
/*
$('.btn-shorten').on('click', () =>{
    $.ajax({
        url: '/test/shorten',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val()},
        success: function(data){
            var resultHTML = '<a class="result" href"' + data.shortUrl + '">' + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow')
        }
    })
})*/