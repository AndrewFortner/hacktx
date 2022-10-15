import React from "react";
import Select from 'react-select';
import axios from 'axios'

export default class imageCompressor extends React.Component {
  uploadAction() {
    var filedata = document.querySelector('input[type="file"]').files[0]
    this.state.data.append("file", filedata)
    this.state.data.append("sr", 16000)
    this.state.data.append("in_lang", this.state.language)
  }
  constructor() {
    super();
    this.state = {
      compressedLink:
        "http://navparivartan.in/wp-content/uploads/2018/11/placeholder.png",
      originalImage: "",
      originalLink: "",
      clickedASR: false,
      clickedTTS: false,
      uploadImage: false,
      outputText: "temp",
      file : "",
      inputText : "",
      language: "",
      data: new FormData()
    };
  }

  handle = e => {
    this.uploadAction()
    this.setState({
      file : e.target.value
    });
  };
  handleLang = e => {
    var temp
    temp = e.label == "English" ? "en" : (e.label == "Spanish" ? "es" : "zh_CN")
    this.setState({
      language : temp
    });
  };

  changeValue = e => {
    this.setState({ inputText: e.target.value });
  };

   clickASR = async e => {
    e.preventDefault();
    const link = "http://0.0.0.0:8000/transcribe-file-multilingual"
    let t = ""
    await axios({
      method: "post",
      url: link,
      data: this.state.data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response.data.text.text)
        t = response.data.text.text
        
      })
      this.setState({outputText: t, clickedASR: true})
    return 1
  };
  clickTTS = async e => {
    e.preventDefault(); 
    this.setState({data: new FormData()})
    this.state.data.append("text", this.state.inputText)
    let link = this.state.language == "en" ? "http://127.0.0.1:8000/transcribe-file" : "http://127.0.0.1:8000/transcribe-file-multilingual"
    let r
    await axios({
      method: "post",
      responseType: 'blob',
      url: link,
      data: this.state.data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response)
        r = response.data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.wav'); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
    return 1;
  };

  

  render() {
    let languages 
  languages = [
    { label: "English", value: 1 },
    { label: "German", value: 2 },
    { label : "Spanish", value: 3}
  ];
    return (
      <div className="m-5">
        <div className="text-light text-center">
          <h3>1. Input Language</h3>
          <h3>2. Upload Wav File or Input Text</h3>
          <h3>3. Click on ASR or TTS</h3>
        </div>

        <div className="row mt-5 text-center">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 text-center">
        <p className="text-white">Language</p>
            
            <div className="d-flex justify-content-center">
              {/* <input
                type="text"
                className="mt-2 w-75"
                onChange={e => this.handleLang(e)}
                value = {this.state.language}
              /> */}
              <Select options={ languages }
               onChange={e => this.handleLang(e)}
              // value = {this.state.language} 
              />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-5">
            <p className="text-white">Input Wav File</p>
              
            
            <div className="d-flex justify-content-center">
              {/* TODO: Handle audio file */}
              <input
                type="file"
                className=" btn btn-light w-75"
                onChange={e => this.handle(e)}
              />
            </div>
          </div>
          
          <div className="col-xl-4 col-lg-4 col-md-12 mt-2 col-sm-12 d-flex justify-content-center align-items-baseline">
            <br />
            {(
              <button
                type="button"
                className=" btn btn-dark"
                onClick={e => this.clickASR(e)}
              >
                ASR
              </button>
            )}
          </div>

            
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            {this.state.clickedASR ? (
              //second image
              <div className="d-flex justify-content-center text-white">
                {this.state.outputText}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 text-center">
          <p className="text-white">Input Text </p>
            <div className="d-flex justify-content-center">
              <input
                type="text"
                className="mt-2 w-75"
                onChange={e => this.changeValue(e)}
                value = {this.state.inputText}
              />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-12 mt-2 col-sm-12 d-flex justify-content-center align-items-baseline">
            <br />
            {(
              <button
                type="button"
                className=" btn btn-dark"
                onClick={e => this.clickTTS(e)}
              >
                TTS
              </button>
            )}
          </div>

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
            {this.state.clickedTTS ? (
              <div className="d-flex justify-content-center text-white">
                {this.state.file}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
}
