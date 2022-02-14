var pop;
/*function setup() {
  pop = new Audio('../../../pop.mp3');
  pop.volume = 0.5;
	chatbot.loadFiles(
    [
      '../../rivescripts/vars.rive',
      '../../rivescripts/01_bot_logic.rive',
      '../../rivescripts/02_bot_logic_pregnancy.rive',
      '../../rivescripts/words.rive',
      '../../rivescripts/bot.rive'
    ]
  );
}
*/

// window.onload = setup;


function setup() {
  pop = new Audio('../../../pop.mp3');
  pop.volume = 0.5;
  on_load_success()
  // chatbot.start();
}

window.onload = setup;