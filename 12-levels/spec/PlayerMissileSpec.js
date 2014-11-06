/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo {} []

*/
describe("Clase PlayerMissile",function(){

  var canvas, ctx;

  beforeEach(function(){
    loadFixtures('index.html');

    canvas = $('#game')[0];
    expect(canvas).toExist();

    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    
    oldGame = Game;
  });

  afterEach(function(){
    Game = oldGame;
   }); 


  it("Los misiles se crean",function(){
      Game = oldGame;
      Game.initialize("game",sprites,function(){});
      
      var board = new GameBoard();
      
      var ship = new PlayerShip();

      board.add(ship);
      Game.keys['fire'] = true;
      spyOn(board,'add');
      misil1 = new PlayerMissile(ship.x,ship.y+ship.h/2);
      
      misil2 = new PlayerMissile(ship.x+ship.w,ship.y+ship.h/2);

      ship.step(1);

      expect(board.add).toHaveBeenCalledWith(misil1);
      expect(board.add).toHaveBeenCalledWith(misil2);
      
  });

  it("Los misiles avanzan",function(){
      Game = oldGame;
      Game.initialize("game",sprites,function(){});

      var board = new GameBoard();
      misil = new PlayerMissile(140,440);

      board.add(misil);
      board.resetRemoved();
      misil.step(1);
      expect(misil.x).toBe(139);
      expect(misil.y).toBe(-270);
  });
  
  it("Hay que soltar el espacio para volver a disparar",function(){

      Game = oldGame;
      Game.initialize("game",sprites,function(){});

      var board = new GameBoard();
      var ship = new PlayerShip();

      board.add(ship);
      
      Game.keys['fire'] = true;
      ship.step(1);
      expect(board.objects.length).toBe(3);
      ship.step(1000000);
      expect(board.objects.length).toBe(3);
      Game.keys['fire'] = false;
      ship.step(1);
      Game.keys['fire'] = true;
      ship.step(1);
      expect(board.objects.length).toBe(5);
  });

});