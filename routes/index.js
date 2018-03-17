var express = require('express');
var router = express.Router();
var firebase = require("firebase");
require('firebase/auth');
require('firebase/database');
var config = {
  apiKey: "AIzaSyBJZWlhRmGnw2x_XxaziNseWhEGRUebCfo",
  authDomain: "todo-47fdf.firebaseapp.com",
  databaseURL: "https://todo-47fdf.firebaseio.com",
  projectId: "todo-47fdf",
  storageBucket: "todo-47fdf.appspot.com",
  messagingSenderId: "1051206041808"
};
firebase.initializeApp(config);
var database = firebase.database();

/* GET home page. */
firebase.auth().signInWithEmailAndPassword("whangwang0430@gmail.com", "wang0430").then(function(user) {
    console.dir('database-connect');
  }, function(error) {
    console.idr('database-error');
});


router.get('/', function(req, res, next) {
    if(req.session.user!=null){
      res.redirect('/main');
    }else{
      res.render('index',{
        title: "ToDo - Login"
      });
    }
});

router.post('/ajax_change_status', function(req, res, next){
  firebase.database().ref('users/' + req.session.user.uid + '/todo/' + req.body.key + '/status').set(true).then(function(){
    res.json({
      status: true
    });
  },function(err){
    res.json({
      status: false,
      err: err,
    });
  });
});

router.post('/ajax_user_logout', function(req, res, next){
  req.session.user = null;
  res.json({
    status: true
  });
});

router.post('/ajax_edit_event', function(req, res, next){
  firebase.database().ref('/users/' + req.session.user.uid + '/todo/' + req.body.key ).update(req.body.update).then(function(){
    firebase.database().ref('/users/' + req.session.user.uid + '/todo').once('value').then(function(snapshot) {
      var origin = snapshot.val();
      var todo = [];
      snapshot.forEach(function(data){
        var json_todo = data.toJSON();
        json_todo.key = data.key;
        if(typeof json_todo.description != "undefined"){
          json_todo.description = json_todo.description.replace(/\n/g,'<br />');
        }else{
          json_todo.description = "";
        }
        todo.push(json_todo);
      });
      res.json({
        status: true,
        todo: todo
      });
    });
  },function(err){
    res.json({
      status: false,
      err: err
    });
  });
});

router.post('/ajax_delete_event', function(req, res, next){
  firebase.database().ref('/users/' + req.session.user.uid + '/todo/' + req.body.key).remove().then(function(){
    firebase.database().ref('/users/' + req.session.user.uid + '/todo').once('value').then(function(snapshot) {
      var origin = snapshot.val();
      var todo = [];
      snapshot.forEach(function(data){
        var json_todo = data.toJSON();
        json_todo.key = data.key;
        todo.push(json_todo);
      });
      res.json({
        status: true,
        todo: todo
      });
    });
  },function(err){
    res.json({
      status: false,
      err: err.message
    });
  });
});

router.post('/ajax_change_name', function(req, res, next){
  firebase.database().ref('users/' + req.session.user.uid + '/name').set(req.body.name).then(function(){
    res.json({
      status: true,
      name: req.body.name
    });
  },function(err){
    res.json({
      status: false,
      err: err.message
    });
  });
});

router.get('/main', function(req, res, next){
  var user = req.session.user;
  if (user!=null) {
    console.dir(user.uid);
    var userId = user.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var origin = snapshot.val();
      var todo = [];
      snapshot.child('todo').forEach(function(data){
        data.val().order = parseInt(data.val().order);
        var json_todo = data.toJSON();
        json_todo.key = data.key;
        todo.push(json_todo);
      });
      var isnew;
      if(origin==null){
        var now = new Date();
        var des = "嗨：<br>感謝您的使用。請按列表上方+號按鈕新增事件，或是按下左側列表+號按鈕新增類別。當事件完成時，請按下事件左上角圈圈註記。<br>ToDo List";
        var aid = String(makeid(8));
        origin={
          category: [{
            id: "allcategory",
            name: "All"
          }],
          todo: [{
            title: "歡迎！",
            category_name: "All",
            category_id: "allcategory",
            description: des,
            date: now,
            status: false,
            order: 1
          }]
        }
        todo.push({
          title: "歡迎！",
          category_name: "All",
          category_id: "All",
          description: des,
          date: now,
          status: false,
          order: 1
        });
        firebase.database().ref('users/' + userId).set(origin);
        isnew = true;
      }else{
        console.dir(origin.name);
        isnew = false;
      }
      var d = new Date();
      res.render('main',{
        name: origin.name,
        uid: user.uid,
        category: origin.category,
        todo: todo,
        week: getweek(),
        now: d.getDay(),
        new_user: isnew
      });
    });
  } else {
    res.render('index',{
      title: "ToDo - Login"
    });
  }
});

router.post('/signup_email_password', function(req, res, next){
  var uid = makeid(10);
  var messageListRef = firebase.database().ref('/userlist');
  var newMessageRef = messageListRef.push();
  newMessageRef.set({
    'uid': uid,
    'email': req.body.email,
    'password': req.body.password
  }).then(function(){
    var data = {
      uid: uid,
      email: req.body.email,
      password: req.body.password
    }
    req.session.user = data;
    res.json({
      status: true
    });
  },function(err){
    res.json({
      status: false,
      err: err.message
    });
  });
});

router.post('/login_email_password', function(req, res, next){
  firebase.database().ref('/userlist').once('value').then(function(snapshot) {
    var check = 0;
    var d;
    snapshot.forEach(function(data){
      if(data.val().email==req.body.email && data.val().password==req.body.password){
        check++;
        d=data;
      }
    });
    if(check){
      req.session.user = d;
      res.json({
        status: true,
        new: false,
        email: req.body.email
      });
    }else{
      res.json({
        status: false,
        err: "Wrong Email or Password"
      });
    }
  },function(error){
    res.json({
      status: false,
      err: error.message
    });
  });
});

router.post('/category_modified',function(req, res, next){
  firebase.database().ref('/users/' + req.session.user.uid + '/category').set(req.body.cg).then(function(){
    res.json({
      status: true,
      category: req.body.cg
    });
  },function(err){
    res.json({
      status: false,
      err: err.message
    });
  });
});

router.post('/ajax_change_order',function(req, res, next){
  firebase.database().ref('/users/' + req.session.user.uid + '/todo').update(req.body.new_order).then(function(){
    res.json({
      status: true
    });
  },function(err){
    res.json({
      status: false,
      err: err
    });
  });
});

router.post('/ajax_add_event',function(req, res, next){
  var messageListRef = firebase.database().ref('/users/' + req.session.user.uid + '/todo');
  var newMessageRef = messageListRef.push();
  req.body.new_event.status = (req.body.new_event.status == 'true');
  newMessageRef.set(req.body.new_event).then(function(){
    firebase.database().ref('/users/' + req.session.user.uid + '/todo').once('value').then(function(snapshot) {
      var origin = snapshot.val();
      var todo = [];
      snapshot.forEach(function(data){
        var json_todo = data.toJSON();
        json_todo.key = data.key;

        todo.push(json_todo);
      });
      res.json({
        status: true,
        todo: todo
      });
    });
  },function(err){
    res.json({
      status: false,
      err: err.message
    });
  });
});

router.post('/check_email', function(req, res, next){
  firebase.database().ref('/userlist').once('value').then(function(snapshot) {
    console.dir('test');
    var check = 0;
    snapshot.forEach(function(data){
      if(data.val().email==req.body.email)check++;
    });
    if(check){
      res.json({
        status: true,
        new: false,
        email: req.body.email
      });
    }else{
      res.json({
        status: true,
        new: true,
        email: req.body.email
      });
    }
  });
});


function makeid(k) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < k; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function getweek() {
    var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var sun = new Date();
    sun.setDate(sun.getDate() - parseInt(sun.getDay()));
    var week = [];
    for( var i = 0; i < 7; i++ ){
      sun.setDate(sun.getDate() - parseInt(sun.getDay()) + i);
      console.dir(sun.toString());
      week.push({
        date: sun.getDate(),
        month: month[sun.getMonth()],
        year: sun.getFullYear(),
      });
    }
    return week;
}


module.exports = router;
