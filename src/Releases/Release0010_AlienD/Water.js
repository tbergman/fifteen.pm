  //       // add water
  //       const params = {
  //         color: '#ffffff',
  //         scale: 4,
  //         flowX: 1,
  //         flowY: 1
  //     };
  //     const waterGeometry = new THREE.PlaneBufferGeometry(50, 50);
  //     const water = new Water(waterGeometry, {
  //         color: params.color,
  //         scale: params.scale,
  //         flowDirection: new THREE.Vector2(params.flowX, params.flowY),
  //         textureWidth: 512,
  //         textureHeight: 512,
  //         normalMap0: this.textureLoader.load('assets/shared/images/water/textures/water/Water_1_M_Normal.jpg'),
  //         normalMap1: this.textureLoader.load('assets/shared/images/water/textures/water/Water_2_M_Normal.jpg'),
  //     });
  //     water.position.y = .2;
  //     water.rotation.x = Math.PI * -0.5;
  //     water.visible = false
  //     scene.add(water);
  //     locationElements[FOREST].push(water);
  //     var riverBottomGeometry = new THREE.PlaneBufferGeometry(16, 9);
  //     var riverBottomMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0. });
  //     var riverBottom = new THREE.Mesh(riverBottomGeometry, riverBottomMaterial);
  //     riverBottom.position.z -= 5;
  //     riverBottom.rotation.x = Math.PI * - 0.5;
  //     riverBottom.visible = false
  //     scene.add(riverBottom);
  //     locationElements[FOREST].push(riverBottom)
  //     videoParents[FOREST] = {
  //         parent: riverBottom,
  //         addDots: false
  //     }
  // }