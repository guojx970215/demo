var UEditorPlugin = {
  dict: {
    showContent: function (content) {
      layer.alert(content, { title: '字典文本' });
    },
    showRichContent: function (dictId) {
      var dictData = $('#' + dictId).attr('dict-data');
      dictData = Base64.decode(dictData);
      dictData = JSON.parse(dictData);

      var dict = dictData;

      var audioContent = '';
      var audio;

      if (dict.dictAudio && !$.isEmptyObject(dict.dictAudio)) {
        audioContent = '<img id="dictAudioPlayIcon" src="' + window.BASE_HOST + '/css/images/audio.png" style="width:16px;margin-left:4px">';
        audio = new Audio(dict.dictAudio.url);
      }

      var isPlaying = false;

      function playAudio(){
        isPlaying = true;
        $('#dictAudioPlayIcon').attr('src', window.BASE_HOST + '/css/images/audio.gif');
        audio.play();
      }

      function stopAudio(){
        isPlaying = false;
        $('#dictAudioPlayIcon').attr('src', window.BASE_HOST + '/css/images/audio.png');
        audio.pause();
        audio.load();
      }

      var dictContent = dict.dictContent;

      if(dict.dictContentLink){
        dictContent = '<a href="' + dict.dictContentLink +'" target="blank">' + dictContent + '</a>';
      }

      var dictImage = '';
      if(dict.dictImage && !$.isEmptyObject(dict.dictImage)){
        dictImage = '<img style="width:100%;" src="' + dict.dictImage.url + '">';
      }

      if(dict.dictImageLink){
        dictImage = '<a href="' + dict.dictImageLink +'" target="blank">' + dictImage + '</a>';
      }

      var origText = $('#' + dictId).find('rb').text();
      var origPinYin = $('#' + dictId).find('rt').text();

      var text = origText + origPinYin;

      if(!text){
        text = $('#' + dictId).text();
      }

      var html = '<div style="padding:10px">' +
          '<div style="padding:4px;">' + text + audioContent + '</div>' +
          '<div style="padding:4px;">' + dictContent + '</div>' +
          '<div style="padding:10px;">' + dictImage + '</div>' +
          '</div>';

      layer.open({
        title: ['字典文本', 'text-align:center;background-color:#3993f9;padding:0px;color:#ffffff'],
        closeBtn:2,
        type: 1,
        content: html,
        area:'200px',
        end:function(){
          stopAudio();
        }
      });

      $('#dictAudioPlayIcon').click(function () {
        if (audio) {
          if (!isPlaying) {
            playAudio();
          } else {
            isPlaying = false;
            stopAudio();
          }
        }
      });

      if(audio){
        playAudio();
      }
    },
  },
};
