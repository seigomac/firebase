(() => {


        "use strict"


        const firebaseConfig = {
            apiKey: "AIzaSyAkm9kyCDFMJKKVrSxwFEURbsOFkc_s0qc",
            authDomain: "myfirebasechatapp-99efe.firebaseapp.com",
            projectId: "myfirebasechatapp-99efe",
            storageBucket: "myfirebasechatapp-99efe.appspot.com",
            messagingSenderId: "354517903265",
            appId: "1:354517903265:web:c1f0d2737d5c3dc8c4cde0",
            measurementId: "G-B7CCGJ2MYE"
        };

        firebase.initializeApp(firebaseConfig);

        // DBを指定する
        const db = firebase.firestore();



        // データを保存した日時
        db.settings({
            timestampsInSnapshots: true
        })

        // DBをオブジェクトに名前をつける
        const collection = db.collection('messages');
        const auth = firebase.auth();
        let me = null;

        // constから受け取った中身を値に代入する
        const message = document.getElementById(`message`);
        const form = document.querySelector(`form`);



        // リロードした時に画面に投稿した一覧を表示
        // const messages = document.getElementById(`messages`);
        // collection.orderBy('created').get().then(snapshot => {
        //     snapshot.forEach(doc => {
        //         const li = document.createElement('li');
        //         li.textContent = doc.data().message;

        //         messages.appendChild(li);
        //     })
        // })


        const messages = document.getElementById('messages');
        const login = document.getElementById('login');
        const logout = document.getElementById('logout');
        // collection.orderBy('created').onSnapshot(snapshot => {
        //     snapshot.docChanges().forEach(change => {
        //         if (change.type === 'added') {
        //             const li = document.createElement('li');
        //             li.textContent = change.doc.data().message;

        //             messages.appendChild(li);
        //         }
        //     });
        // });



        login.addEventListener('click', () => {
            auth.signInAnonymously();
        });

        logout.addEventListener('click', () => {
            auth.signOut();
        });

        auth.onAuthStateChanged(user => {
            if (user) {
                me = user;

                while (messages.firstChild) {
                    messages.removeChild(messages.firstChild)
                }
                collection.orderBy('created').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const li = document.createElement('li');
                            const d = change.doc.data();
                            li.textContent = d.uid.substr(0, 8) + ":" + change.doc.data().message;

                            messages.appendChild(li);

                        }
                    });
                }, error => { });
                console.log(`Logged in as: ${user.uid}`);
                login.classList.add('hidden');
                [logout, form, messages].forEach(el => {
                    el.classList.remove('hidden');
                });
                message.focus();
                return;
            }
            me = null;
            console.log('Nobody is logged in');
            login.classList.remove('hidden');
            // form.classList.add('hidden');
            [logout, form, messages].forEach(el => {
                el.classList.add('hidden');
            });
        });


        // Returnを押した時
        form.addEventListener('submit', e => {
            // ↓ページが遷移しないようにするためのもの
            e.preventDefault();

            const val = message.value.trim();
            if (val === "") {
                return;
            }

            // liの要素作成
            // const li = document.createElement('li');
            // // liの中身はmessageの中身uid

            // li.textContent = val;

            // messages.appendChild(li);
            message.value = '';
            message.focus();

            // データを送る処理
            // データを保存してDocumentにユニークなIDをつけてくれます
            collection.add({
                message: val,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                uid: me ? me.uid : "nobody"
            })
                // メッセージがうまく入ったら
                .then(doc => {
                    console.log(` ${doc.id} add!`);
                    // メッセージ送信に成功した場合、フォームの中を空にする

                })
                // メッセージが異常だったら
                .catch(error => {

                    console.log('document add error');
                    console.log(error);
                });
        })
})();
