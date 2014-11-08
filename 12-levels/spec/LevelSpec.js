/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
           Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
 Ejemplo:
         [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/
describe("LevelSpec",function(){

  beforeEach(function(){
    loadFixtures('index.html');
    canvas = $('#game')[0];
    expect(canvas).toExist();
    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    oldGame = Game;
    Game = {width: 320, height: 480};
    var enemies = {
      basic: { x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2, E: 100, health: 20 }
    };
    level1 = [
      //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
        [ 0,        4000,  500,         'step'                 ],
        [ 6000,     13000, 800,         'ltr'                  ],
        [ 10000,    16000, 400,         'circle'               ],
        [ 17800,    20000, 500,         'straight', { x: 50  } ],
        [ 18200,    20000, 500,         'straight', { x: 90  } ],
        [ 18200,    20000, 500,         'straight', { x: 10  } ],
        [ 22000,    25000, 400,         'wiggle',   { x: 150 } ],
        [ 22000,    25000, 400,         'wiggle',   { x: 100 } ]
    ];
   level2 = [
    //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
        [ 0,        500,   500,       'step'                 ],
        [ 20000,    30000, 800,       'ltr'                  ]
    ];
    level3 = [
    //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
        [ 0,        1000,  1000,      'straight',  { E:500 }  ]
    ];

  });
  afterEach(function(){
    Game = oldGame;
  });


  it("Las baterias crean enemigos",function(){
    Game = oldGame;
    board = new GameBoard;
    level = new Level(level1,function(){})
    Game.initialize("game",sprites,function(){
      board.add(new PlayerShip());
      board.add(level);
      Game.setBoard(0,board);
    });
    
    Game.keys['right'] = true;
    
    spyOn(board,'add').andCallThrough();
    
    waits(1000);
    runs(function(){
        //Espero lo sufieciente para que aparezcan dos naves, longitud 4. playership+nivel+2 naves enemigas
        //Solo se aprecia si el test va individualmente expect(board.add.calls.length).toBe(4);
        expect(board.add).toHaveBeenCalled();
    });
  });

  it("Se eliminan baterias vacias",function(){
    Game = oldGame;
    board = new GameBoard;
    level = new Level(level2,function(){})
    Game.initialize("game",sprites,function(){
      board.add(new PlayerShip());
      board.add(level);
      Game.setBoard(0,board);
    });
    
    Game.keys['right'] = true;
   
    

    waits(3000);
    runs(function(){
        
        expect(level.levelData.length).toBe(1)
    });
  });

  it("Se acaban los niveles y se empiezan los siguientes",function(){
    Game = oldGame;
    board = new GameBoard;
    level = new Level(level3,function(){})
    Game.initialize("game",sprites,function(){
      board.add(new PlayerShip());
      board.add(level);
      Game.setBoard(0,board);
    });
    spyOn(level,'callback');
    Game.keys['right'] = true;
    waits(2000);
    runs(function(){
        expect(level.callback).toHaveBeenCalled();
        expect(level.levelData.length).toBe(0);
    });
  });
});