import * as THREE from '../../build/three.module.js';

export class Character{

  constructor(model, helper, pos){
    this.character = model;
    this.pos = pos!=undefined ? pos:new THREE.Vector3();

    this.helper = helper;

    this.moveSpeed = 1;
    this.direction = new THREE.Vector3();
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.jump = false;

    /*
      idle : 0
      walk : 1
      run  : 2
    */
    this.myActions = [];
    this.myState = 0;
  }
  update(delta){
    this.helper.update(delta);
    this.handleAction(delta);
    this.stateMachine();
  }
  onKeyDown(key, dir, theta){
    dir.y = 0;
    this.direction.copy(dir);
    this.theta = theta;
    switch( key ){
      case 38: /*up*/
      case 87: /*W*/
        this.moveForward = true;
        break;
      case 40: /*down*/
      case 83: /*S*/
        this.moveBackward = true;
        break;
      case 37: /*left*/
      case 65: /*A*/
        this.moveLeft = true;
        break;
      case 39: /*right*/
      case 68: /*D*/
        this.moveRight = true;
        break;
      case 32: /*space*/
        this.jump = true;
        break;
      }
    }
  onKeyUp(key){
    switch( key ){
      case 38: /*up*/
      case 87: /*W*/
        this.moveForward = false;
        break;
      case 40: /*down*/
      case 83: /*S*/
        this.moveBackward = false;
        break;
      case 37: /*left*/
      case 65: /*A*/
        this.moveLeft = false;
        break;
      case 39: /*right*/
      case 68: /*D*/
        this.moveRight = false;
        break;
      case 32: /*space*/
        this.jump = false;
        break;
    }
  }
  handleAction(delta){
    if( this.moveForward ){

      if( this.moveLeft ){
        this.pos.add(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/4).normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 - (3*Math.PI)/4;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 + (5*Math.PI)/4, 0.1);
      }
      else if( this.moveRight ){
        this.pos.add(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/4).normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 + (3*Math.PI)/4;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 + (3*Math.PI)/4, 0.1);
      }
      else{
        this.pos.add(this.direction.normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 + Math.PI;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 + Math.PI, 0.1);
      }
    }
    else if( this.moveBackward ){

      if( this.moveLeft ){
        this.pos.sub(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/4).normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 - Math.PI/4;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 - Math.PI/4, 0.1);
      }
      else if( this.moveRight ){
        this.pos.sub(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/4).normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 + Math.PI/4;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 + Math.PI/4, 0.1);
      }
      else{
        this.pos.sub(this.direction.normalize().multiplyScalar(this.moveSpeed * delta));
        this.character.rotation.y = this.theta * Math.PI / 360 ;
        //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 , 0.1);
      }
    }
    else if( this.moveLeft ){
      this.pos.add(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/2).normalize().multiplyScalar(this.moveSpeed * delta));
      this.character.rotation.y = this.theta * Math.PI / 360 - Math.PI/2;
      //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 - Math.PI/2, 0.1);
    }
    else if( this.moveRight ){
      this.pos.add(this.direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/2).normalize().multiplyScalar(this.moveSpeed * delta));
      this.character.rotation.y = this.theta * Math.PI / 360 + Math.PI/2;
      //this.character.rotation.y = THREE.Math.lerp(this.character.rotation.y, this.theta * Math.PI / 360 + Math.PI/2, 0.1);
    }
    this.character.position.copy(this.pos);
  }
  stateMachine(){
    if( this.moveForward || this.moveBackward || this.moveLeft || this.moveRight ){
      if( this.myState != 1 ){
        this.myState = 1;
        this.executeCrossFade(this.myActions['idle'], this.myActions['walk'], 0.1);
      }
    }
    else {
      if( this.myState != 0 ){
        this.myState = 0;
        this.executeCrossFade(this.myActions['walk'], this.myActions['idle'], 0.1);
      }
    }
  }
  executeCrossFade(startAction, endAction, duration) {

    this.setWeight(endAction, 1);
    endAction.time = 0;
    startAction.crossFadeTo(endAction, duration, false);
  }
  setWeight(action, weight) {

    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }
}
