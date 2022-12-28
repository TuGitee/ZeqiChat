window.onload = () => {
    const register = document.getElementById('register');
    const CaptchaButton = document.getElementById('CaptchaButton');
    CaptchaButton.onclick = () => {
        CaptchaButton.disabled = true;
        CaptchaButton.style.filter=`brightness(0.7)`
        let seconds = 60;
        CaptchaButton.style.pointerEvents = 'none';
        CaptchaButton.innerHTML = `获取验证码(${seconds}s)`;
        let timer = setInterval(() => {
            if(seconds <= 0) {
                clearInterval(timer);
                CaptchaButton.style.filter=`brightness(1)`
                CaptchaButton.style.pointerEvents = 'auto';
                CaptchaButton.disabled = false;
                CaptchaButton.innerHTML = `获取验证码`;
                return;
            }
            seconds--;
            CaptchaButton.innerHTML = `获取验证码(${seconds}s)`;
        }, 1000);
        const email = document.getElementById('email').value;
        axios.post('/api/captcha', { email })
            .catch((error) => {
                console.log(error);
            });
    }
    register.onclick = () => {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const repassword = document.getElementById('repassword').value;
        const captcha = document.getElementById('captcha').value;
        const avatar = document.getElementById('avatar').files[0];
        if (email === '' || username === '' || password === '' || repassword === '' || captcha === '') {
            alert('请填写完整');
            return;
        }
        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('username', username);
        formdata.append('password', password);
        formdata.append('repassword', repassword);
        formdata.append('captcha', captcha);
        formdata.append('avatar', avatar);
        formdata.append('localcaptcha', localStorage.getItem('captcha'));
        axios.post('/api/register', formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res)=>{
            if(res.data.ok===1){
                alert('注册成功');
                window.location.href='/login';
            }else{
                alert(res.data.msg);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
}