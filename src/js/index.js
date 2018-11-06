import $ from 'jquery';
import '../style/index.less';

class Index {
  constructor(){
    $('#root').text('Index 你好，啦啦啦');
    this.init();
  }

  init() {
    fetch('/api/v1/topics')
      .then(response => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }

        return response.json()
      })
      .then(res => {
        console.log('res:', res)
      })
  }
}

$(() => {
  new Index();
});