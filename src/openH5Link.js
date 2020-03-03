export default function openH5Link(link) {
    if (window.api) {
        window.api.openWin({
            name: 'h5Win',
            url: 'widget://h5.html',
            pageParam: {
                link: link
            }
        });
    } else {
        window.open(link);
    }
}
