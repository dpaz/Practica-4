/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.
{}
*/
describe("Clase GameBoard",function(){
  beforeEach(function(){
    loadFixtures('index.html');
    canvas = $('#game')[0];
    expect(canvas).toExist();
    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    oldGame = Game;
    Game = {width: 320, height: 480};

  });
  afterEach(function(){
    Game = oldGame;
  });

  it("Añade elementos a board",function(){
    var board = new GameBoard();

    spyOn(board,"add").andCallThrough();

    var obj = new Object;

    board.add(obj);
    expect(board.add).toHaveBeenCalled();
    expect(board.objects.length).toEqual(1);
    expect(board.objects[0]).toBe(obj);
  });

  it("Elimina elementos a board",function(){
    var board = new GameBoard();
    spyOn(board,"remove").andCallThrough();
    spyOn(board,"finalizeRemoved").andCallThrough();
    spyOn(board,"resetRemoved").andCallThrough();
    var obj = new Object;

    board.add(obj);
    board.resetRemoved();
    board.remove(obj);

    expect(board.remove).toHaveBeenCalled();
    expect(board.removed.length).toEqual(1);
    expect(board.removed[0]).toBe(obj);

    board.finalizeRemoved();

    expect(board.finalizeRemoved).toHaveBeenCalled();
    board.resetRemoved();
    expect(board.resetRemoved.calls.length).toEqual(2);
    expect(board.removed.length).toEqual(0);
  });


  it("Usa draw y step de los elementos",function(){
    
    function obj(){
      this.step = function (){};
      this.draw = function (){}
    }

    var board = new GameBoard();

    spyOn(board,"draw").andCallThrough();
    spyOn(board,"step").andCallThrough();

    Game = oldGame;
    for(i=0;i<10;i++){
      board.add(new obj);
      spyOn(board.objects[i],"draw");
      spyOn(board.objects[i],"step");
    }
    
    

    Game.initialize("game",sprites,function(){});  
    Game.setBoard(1,board);

    waits(100);
    runs(function(){
      expect(board.step).toHaveBeenCalled();
      expect(board.draw).toHaveBeenCalled();
      for(i=0;i<10;i++){
        expect(board.objects[i].draw).toHaveBeenCalled();
        expect(board.objects[i].step).toHaveBeenCalled();
      } 
    });

  });

  it("Detecta overlap",function(){
    var board = new GameBoard();

    var objRef = {
      x : 0,y : 0,
      w : 10, h:10
     };
    var objC = {
      x : 0,y : 0,
      w : 10, h:10
    };
    var objNC = {
      x : 30,y : 30,
      w : 10, h:10
    };

    board.add(objRef);
    board.add(objC);
    board.add(objNC);

    expect(board.overlap(objRef,objC)).toBeTruthy();
    expect(board.overlap(objRef,objNC)).toBeFalsy();
  
  });

  it("Detecta colisiones",function(){

    var board = new GameBoard();

    var objRef = {
      x : 0,y : 0,
      w : 10, h:10,
      type: 0
     };
    var objC = {
      x : 0,y : 0,
      w : 10, h:10,
      type: 2
    };
    var objNC = {
      x : 30,y : 30,
      w : 10, h:10,
      type: 4
    };

    board.add(objRef);
    board.add(objC);
    board.add(objNC);

    expect(board.collide(objRef,objC.type)).toBe(objC);
    expect(board.collide(objRef,objNC.type)).toBeFalsy();

    
  });
});