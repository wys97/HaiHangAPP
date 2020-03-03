export default function openProductLink(link) {
    if (window.api) {
        window.api.openWin({
            name: 'productWin',
            url: 'widget://product.html',
            pageParam: {
                link: link
            }
        });
    } else {
        window.location.href = link;
    }
}
