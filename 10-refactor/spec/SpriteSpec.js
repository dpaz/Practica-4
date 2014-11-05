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


  it("Setup usa diferentes sprites",function(){
    Game = oldGame;
    Game.initialize("game",sprites,function(){});

    spyOn(PlayerShip.prototype,'setup');
    spyOn(PlayerMissile.prototype,'setup');
    spyOn(Enemy.prototype,'setup');

    ship = new PlayerShip();
    misil = new PlayerMissile(ship.x,ship.y);
    enemy = new Enemy({ x: 100, y: -50, sprite: 'enemy_purple', B: 100, C: 2, E: 100 });

    expect(PlayerShip.prototype.setup.calls[0].args[0]).toBe('ship');
    expect(PlayerMissile.prototype.setup.calls[0].args[0]).toBe('missile');
    expect(Enemy.prototype.setup.calls[0].args[0]).toBe('enemy_purple');
  });

  it("Se añaden las propiedades",function(){
    Game = oldGame;
    Game.initialize("game",sprites,function(){});

    spyOn(PlayerMissile.prototype,'setup').andCallThrough();
    misil = new PlayerMissile(0,0);

    expect(misil.vy).toBe(-700);
    expect(misil.x).toBe(-1);
    expect(misil.y).toBe(-10);
  });
});