# DriveGL
## Play The Game: (not currently working, problem loading scripts)
https://dannyplatt.github.io/DriveGL/ 

## Adding shapes:
**Add primitive**
If we want to add a new primitive:
- Create the new object in shape.js
    - It should have the same format as cube

**Add shape to scene**
- Within scene.js, the new drawings to the scene array
- not, it must be at the end. Currently the 0th shape is the controlable player
```
  {
    type: cube,
    position: [2,0,5],
    scale: [1,1,1]
  },

```
- type is the name of the object, thus when the scene is drawn, it checks this reference to the data in the shape file
- 

## Camera info
- Camera info is held within state.camera
### Tracking:
**Position**
- Within physics.js, mover.update(state), Update the camera position. This works only if we have one mover object. We should fix this.
```
vec3.add(state.camera.at, state.camera.at, this.velocity);
vec3.add(state.camera.position, state.camera.position, this.velocity);
``` 
- This way we add the same change in position to the camera as we do to the player object
**Rotation**
- Camera rotation effected in keyPreseses.js in function checkKeys
- When 'a' or 'd' is pressed, we rotate the camera about the player position point
```
else if(keysPressed['d']){
  vec3.rotateY(state.camera.position, state.camera.position, state.objects[0].model.position, -rotateVel);
```
**Adjustment**
- Camera adjustment can be made using the arrow keys:
    - Up and down arrow keys effect Z position
    - Left and right arrow keys effect X position
    - Q and E adjust the Z value position
- Rotation (not currently working well)
- Tilt can be (somewhat) adjusted using 'w' and 's' keys

## Player Movement:
- We are setting key values as true if the key is pressed, and false once the key is released
- Within the game loop, we check which keys are labeled 'true' and apply their effects
