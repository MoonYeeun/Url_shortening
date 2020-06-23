import React, { Component } from 'react';
import './App.css';
import axios from "axios";

// url 줄이기 위해 서버로 보냄
export const createShortUrl = obj => {
  return axios.post('/urlShort', {
    obj : obj
  })
};

class App extends Component {
  state = {
    url: '',
    shortUrl: '',
    isUrl: false
  }

  // url 창 입력 변화 감지
  handleChange = (e) => {
    this.setState({
      url: e.target.value,
      shortUrl: ''
    });
  };

  // 입력된 url 서버로 보내기
  handleSubmit = (e) => {
    let { url } = this.state;
    // url 유효성 검사
    const urlRegex = /(http(s)?:\/\/)?w{3}(\.\w+)+(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    url = url.replace(/(\s*)/g, ""); // 공백제거
    const str = url.match(urlRegex);

    if(str == null) {
      alert('올바른 주소 값을 입력하세요.');

      this.setState({url : ''});
    } else {
      e.preventDefault();

      createShortUrl(str[0])
      .then(json => {
        this.setState({
          shortUrl : json.data.shortUrl
        });
      })
      .catch(error => {
        alert(error);
      });  
    }
  }

  render() {
    return (
      <div className ="App">
      <div className="header">
        <h3 className="header-1">U</h3>
        <h3 className="header-2">r</h3>
        <h3 className="header-3">l</h3>
        <h3 className="header-4"> - </h3>
        <h3 className="header-5">s</h3>
        <h3 className="header-6">h</h3>
        <h3 className="header-7">o</h3>
        <h3 className="header-8">r</h3>
        <h3 className="header-9">t</h3>
        <h3 className="header-10">e</h3>
        <h3 className="header-11">n</h3>
        <h3 className="header-12">i</h3>
        <h3 className="header-13">n</h3>
        <h3 className="header-14">g</h3>
        <h3 className="header-15">!</h3>
        </div>
      <form onSubmit={this.handleSubmit}> 
          <input className= "input"
            placeholder="url"
            value={this.state.url}
            onChange={this.handleChange}
          />
          <button className="create-button" type="submit" value="Submit">click</button>
          <div className="show-short-url" ref={ref => this.result = ref} onChange={this.handleChange}>{this.state.shortUrl}</div>
        </form></div>
    );
  }
}

export default App;
