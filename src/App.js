import React from 'react';
import './App.css';

const imgUrl = "https://m.360buyimg.com/babel/jfs/t1/99907/33/8155/1050432/5e01bb83E33421c26/23e22ef5f8fdea5b.png";
let lazyObserver = null;
let loadObserver = null;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgList: []
    }
  }

  componentDidMount() {
    this.loadItem(10);
    // 滚动加载监听器
    this.setLoadObserver();
    // 图片懒加载
    this.setLazyObserver();
  }
  /**
   * 图片懒加载 + 曝光
   */
  setLazyObserver() {
    lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0 && entry.intersectionRatio <= 1) {  
          entry.target.src = entry.target.dataset.src;
          console.log(`图片-${entry.target.dataset.index}加载成功`);
          // 增加曝光
          this.reportExpose(entry.target.dataset.index);
          // 图片加载完成,取消监听
          lazyObserver.unobserve(entry.target);
        }
      })
    }, {
      root: null,
      rootMargin: "0px 0px 30px 0px"
    })
  }
  /**
   * 上报曝光
   */
  reportExpose(index) {
    console.log(`图片-${index}已曝光`);
  }
  /**
   * 为新增的图片添加监听
   */
  addObserver() {
    const imgArr = document.querySelectorAll('.img-lazyload');
    imgArr.forEach((dom) => {
      // 当该图片还未加载时，添加监听。
      if (!dom.src) {
        lazyObserver.observe(dom);
      }
    })
  }
  /**
   * 滚动加载监听器
   */
  setLoadObserver() {
    loadObserver = new IntersectionObserver((entries, observer) => {
      // 当列表底部标志位进入视口时，触发加载
      if (entries[0].intersectionRatio > 0) {
        this.loadItem(10);
      }
    }, {
      root: null,
      rootMargin: "0px 0px 30px 0px"
    })
    loadObserver.observe(document.querySelector('.list-footer'));
  }
  /**
   * 加载数据
   */
  loadItem(amount) {
    let { imgList } = this.state;

    imgList = imgList.concat(Array(amount).fill(imgUrl));

    console.log("加载列表");

    this.setState({
      imgList
    }, () => {
      this.addObserver();
    })
  }

  render() {
    const { imgList } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Intersection Observer API Demo</h1>
        </header>
        <content className="content">
          {
            imgList.map((img, index) => {
              return (
                <div className="img-box" key={index}>
                  <img className="img-lazyload" data-src={img} data-index={index} />
                  <p className="num">{index}</p>
                </div>
              )
            })
          }
          {/* 页尾栏 */}
          <div className="list-footer"></div>
        </content>
      </div>
    );
  }
}

export default App;
