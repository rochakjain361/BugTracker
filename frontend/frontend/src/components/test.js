import React ,{ Component } from "react";

class Test extends Component{
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
      setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
    
    componentDidMount(){
        var cookie = this.getCookie('BUGTRACKER_CSRFTOKEN')
        console.log(cookie)
        this.setCookie('TESTCOOKIE','xyz', 365)
        var c = this.getCookie('TESTCOOKIE')
        console.log(c)
    }

    render(){
        return(
            <div>
            </div>
        )
    }
}

export default Test