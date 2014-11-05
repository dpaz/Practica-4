describe("Clase Fireball",function(){

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


  it("Las Fireball se crean en la direccion que queremos",function(){
      Game = oldGame;
      Game.initialize("game",sprites,function(){});
      
      var board = new GameBoard();
      
      var ship = new PlayerShip();

      board.add(ship);
      Game.keys['fire'] = false;
      Game.keys['fbIzq'] = true;
      spyOn(board,'add').andCallThrough();;
      
      ship.step(1);
      
      Game.keys['fbIzq'] = false;
      ship.step(1);
      Game.keys['fbDer'] = true;
      ship.step(1);        
      expect(board.add.calls.length).toBe(2);
      expect(board.objects[1].rumbo).toBe('izq');
      expect(board.objects[2].rumbo).toBe('der');
  });


});  