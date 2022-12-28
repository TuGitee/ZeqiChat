window.onload = () => {
    const login = document.getElementById('login');
    login.onclick = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === '' || password === '') {
            alert('请填写完整');
            return;
        }
        axios.post('/api/login', { email, password })
            .then((res) => {
                if (res.data.ok === 1) {
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('user', res.data.user);
                    localStorage.setItem('avatar', res.data.avatar);
                    window.location.href = '/home';
                } else {
                    alert(res.data.msg);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
}