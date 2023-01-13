import { ClientSVG3D } from "../src/clientSVG3D";
import { DataInteractive } from "../src/models/simple.models";
import { dataShops2 } from "./dataItems";

import * as THREE from "three";

export function testmylib(): boolean {
  console.log("testmylib");
  const nodeMap = document.getElementById("map3d");

  const baloonTheme = {
    colorBG: "#eeeeee",
    colorTitle: "#000000",
    colorDescription: "#000000",
    isPositionFixed: false,
    top: 0,
    left: 0,
  };
  if (nodeMap) {
    const map1: ClientSVG3D = new ClientSVG3D(
      nodeMap, // node - dom element to insert svg
      dataShops2, // dataItems - data to render
      {
        title: "Пример карты", // Head Title this map
        interactiveLayer: "shops", // Layer name for interactive
        urlmap: "./public/grand-floor-1-final.svg", // Path to map svg
        isRemoveUnuseItem: false, // Remove unuse item from map?
        funcParams: "https://www.google.com", // Params for function click on item
        paramsMap: {
          positions: new THREE.Vector3(-700, -220, 2),
          rotations: new THREE.Vector3(0, 0, 0),
          scales: new THREE.Vector3(0.5, 0.5, 0.5),
        },
      },
      baloonTheme
    );

    const btnsh1 = document.getElementById("viewShop1");
    const btnsh2 = document.getElementById("viewShop2");
    const btnsh3 = document.getElementById("viewShop3");
    const btnMap1 = document.getElementById("getMap1");
    const btnMap2 = document.getElementById("getMap2");
    const btnMap3 = document.getElementById("getMap3");
    const btnMap4 = document.getElementById("getMap4");
    const btnMap5 = document.getElementById("getMap5");
    btnsh1?.addEventListener("click", () => {
      selectShop("Shape-2-50");
    });
    btnsh2?.addEventListener("click", () => {
      selectShop("Shape-2-01");
    });
    btnsh3?.addEventListener("click", () => {
      selectShop("Shape-2-11");
    });
    btnMap1?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap1.classList.add("active");
      selectMap("floor-1");
    });
    btnMap2?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap2.classList.add("active");
      selectMap("floor-2");
    });
    btnMap3?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap3.classList.add("active");
      selectMap("floor-3");
    });
    btnMap4?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap4.classList.add("active");
      selectMap("floor-4");
    });
    btnMap5?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap5.classList.add("active");
      selectMap("floor-5");
    });

    function clearActiveFloor(): void {
      const btns = document.querySelectorAll(".btn__map_floor");
      btns.forEach((btn) => {
        btn.classList.remove("active");
      });
    }
    map1.start();
    const groupTree = new THREE.Group();
    groupTree.name = "building";
    groupTree.position.x = 0;
    groupTree.position.y = 0;
    groupTree.position.z = 0;
    selectMap("floor-1");
    console.log("START MAP =>> ", map1);
    function selectShop(dataelement: any): void {
      console.log("selectShop element = ", dataelement);
      //const geturl = dataelement.getAttribute('data-url')

      map1.selectItem(dataelement);
    }
    async function selectMap(floorMap: any): Promise<void> {
      console.log("selectMap element = ", floorMap);
      console.log("selectMap scenePublic = ", map1.scenePublic);
      //const geturl = dataelement.getAttribute('data-url')
      nodeMap.innerHTML = "";
      switch (floorMap) {
        case "floor-1":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-1-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 5),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-1");
          addFloor(map1, "floor-1");
          /* map1.addObject({
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 2, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-460, -27, 3),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(205, 120, 3),
          }); */
          /*           map1.addText({
            text: "Вход №2",
            color: 0xff0000,
            size: 12.0,
            position: { x: -10, y: -50, z: 50 },
            rotation: { x: Math.PI / 2, y: 0, z: 0 },
          }); */
          /* map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-20, 10, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-50, 45, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1.25, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(267, 58, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 4, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(336, -10, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1.52, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-285, 47, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/lift.obj",
            urlMTL: "./public/3dobj/obj/lift.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 0.01, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(284, 4, 0),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/lift.obj",
            urlMTL: "./public/3dobj/obj/lift.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 1.0, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(326, 41, 0),
          }); */
          console.log("SELECT MAP 1 =>> ", map1);
          break;
        case "floor-2":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-2-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 35),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-2");
          addFloor(map1, "floor-2");
          /* map1.addObject({
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(380, -40, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-30, 83, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-20, 10, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-50, 45, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1.25, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(267, 58, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 4, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(336, -10, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/elevator.obj",
            urlMTL: "./public/3dobj/obj/elevator.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1.52, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(-285, 47, 18),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/lift.obj",
            urlMTL: "./public/3dobj/obj/lift.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 0.01, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(284, 4, 27),
          });
          map1.addObject({
            urlOBJ: "./public/3dobj/obj/lift.obj",
            urlMTL: "./public/3dobj/obj/lift.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 1.0, 0),
            scale: new THREE.Vector3(50.0, 50.0, 50.0),
            position: new THREE.Vector3(326, 41, 27),
          }); */
          console.log("SELECT MAP 2 =>> ", map1);
          break;
        case "floor-3":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-3-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 65),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-3");
          addFloor(map1, "floor-3");
          addRoof(map1, "floor-3");
          break;
        case "floor-4":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-4-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 95),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-4");
          addFloor(map1, "floor-4");
          addRoof(map1, "floor-4");
          break;
        case "floor-5":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-5-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 120),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-5");
          addFloor(map1, "floor-5");
          addRoof(map1, "floor-5");
          break;
        case "floor-0":
          map1.clearThree(map1.scenePublic);
          map1.options.urlmap = "./public/grand-floor-0-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 95),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          addWall(map1, "floor-0");
          addFloor(map1, "floor-0");
          break;
        default:
          break;
      }
      map1.init();
      addTexts(map1);
      const loadObj = await map1.addObject({
        urlOBJ: "./public/3dobj/car-2.obj",
        color: 0x850000,
        //urlMTL: "./public/3dobj/car-2.mtl",
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(0.2, 0.2, 0.2),
        position: new THREE.Vector3(550, 60, 6),
        isAnimation: true,
      });
      //console.log("LOAD OBJ =>> ", loadObj);
      /* map1.addAnimation(loadObj.children[0], {
        numberOfSteps: 6,
        positionKeys: [0, 1, 2, 3, 4, 5],
        positionSteps: [
          400, 0, 0, 800, 0, 0, 1200, 50, 0, 1600, 0, 0, 2000, 0, 0, 2400, 0, 0,
        ],
        opacityKeys: [0, 1, 4, 5],
        opacitySteps: [0, 1, 1, 0],
      }); */

      /*const loadObj2 = await map1.addObject({
        urlOBJ: "./public/3dobj/car-2.obj",
        color: 0x850000,
        //urlMTL: "./public/3dobj/car-2.mtl",
        rotation: new THREE.Vector3(Math.PI / 2, Math.PI, 0),
        scale: new THREE.Vector3(0.2, 0.2, 0.2),
        position: new THREE.Vector3(2550, 60, 6),
        isAnimation: true,
      });
      //console.log("LOAD OBJ =>> ", loadObj);
      map1.addAnimation(loadObj2.children[0], {
        numberOfSteps: 6,
        positionKeys: [0, 1, 2, 3, 4, 5],
        positionSteps: [
          2500, 50, 0, 2000, 50, 0, 1600, 50, 0, 1200, 50, 0, 800, 50, 0, 400, 50, 0,
        ],
        opacityKeys: [0, 1, 4, 5],
        opacitySteps: [0, 1, 1, 0],
      }); */
    }
  }
  function addRoof(map: ClientSVG3D, floor: string): void {
    let zPozitions: number;
    switch (floor) {
      case "floor-1":
        zPozitions = 0;
        break;
      case "floor-2":
        zPozitions = 0;
        break;
      case "floor-3":
        zPozitions = 90;
        break;
      case "floor-4":
        zPozitions = 90;
        break;
      case "floor-5":
        zPozitions = 90;
        break;
      default:
        zPozitions = 0;
        break;
    }
    map.addSVGExtrudeObject({
      groupObjects: new THREE.Group(),
      settingsGroup: {
        nameGroup: "roof",
        positions: new THREE.Vector3(0, 0, 0),
        /*scales: new THREE.Vector3(0.5, 0.5, 1.0), */
      },
      nameLayerSVG: "roof",
      settingsExtrude: {
        depth: 60,
        bevelEnabled: false,
      },
      material: new THREE.MeshPhongMaterial({
        color: 0x212122,
        specular: 0x222222,
        emissive: 0x777777,
        shininess: 6,
        transparent: false,
        wireframe: false,
      }),
      shadow: {
        castShadow: true,
        receiveShadow: true,
      },
    });
  }
  function addFloor(map: ClientSVG3D, floor: string): void {
    let zPozitions: number;
    switch (floor) {
      case "floor-1":
        zPozitions = 0;
        break;
      case "floor-2":
        zPozitions = 30;
        break;
      case "floor-3":
        zPozitions = 60;
        break;
      case "floor-4":
        zPozitions = 90;
        break;
      case "floor-5":
        zPozitions = 120;
        break;
      default:
        zPozitions = 0;
        break;
    }
    map.addSVGExtrudeObject({
      groupObjects: new THREE.Group(),
      settingsGroup: {
        nameGroup: "floor",
        positions: new THREE.Vector3(0, 0, zPozitions),
        /*scales: new THREE.Vector3(0.5, 0.5, 1.0), */
      },
      nameLayerSVG: "floor",
      settingsExtrude: {
        depth: 5,
        bevelEnabled: false,
      },
      material: new THREE.MeshPhongMaterial({
        color: 0x212122,
        specular: 0x222222,
        emissive: 0x777777,
        shininess: 6,
        transparent: false,
        wireframe: false,
      }),
      shadow: {
        castShadow: true,
        receiveShadow: true,
      },
    });
  }
  function addWall(map: ClientSVG3D, floor: string): void {
    let wallHeight: number;
    switch (floor) {
      case "floor-1":
        wallHeight = 30;
        break;
      case "floor-2":
        wallHeight = 60;
        break;
      case "floor-3":
        wallHeight = 90;
        break;
      case "floor-4":
        wallHeight = 120;
        break;
      case "floor-5":
        wallHeight = 150;
        break;
      default:
        wallHeight = 30;
        break;
    }
    map.addSVGExtrudeObject({
      groupObjects: new THREE.Group(),
      settingsGroup: {
        nameGroup: "wall",
        positions: new THREE.Vector3(0, 0, 0),
      },
      nameLayerSVG: "wall",
      settingsExtrude: {
        depth: wallHeight,
        bevelEnabled: false,
      },
      material: new THREE.MeshPhongMaterial({
        color: 0x115281,
        specular: 0x666666,
        emissive: 0x777777,
        shininess: 6,
        opacity: 0.2,
        transparent: true,
        wireframe: false,
      }),
      shadow: {
        castShadow: false,
        receiveShadow: false,
      },
    });
  }
  function addTexts(map: ClientSVG3D): void {
    console.log("Add Text Object");
    map.addTextToSVGPoint(
      {
        text: "№1",
        color: 0x666666,
        size: 25.0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        shadow: {
          castShadow: true,
          receiveShadow: true,
        },
      },
      "entrance-1"
    );
    map.addTextToSVGPoint(
      {
        text: "№2",
        color: 0x666666,
        size: 25.0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        shadow: {
          castShadow: true,
          receiveShadow: true,
        },
      },
      "entrance-2"
    );
    map.addTextToSVGPoint(
      {
        text: "№3",
        color: 0x666666,
        size: 25.0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, Math.PI / 8),
        shadow: {
          castShadow: true,
          receiveShadow: true,
        },
      },
      "entrance-3"
    );
    map.addTextToSVGPoint(
      {
        text: "№4",
        color: 0x666666,
        size: 25.0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        shadow: {
          castShadow: true,
          receiveShadow: true,
        },
      },
      "entrance-4"
    );
    map.addTextToSVGPoint(
      {
        text: "№5",
        color: 0x104465,
        size: 40.0,
        position: new THREE.Vector3(0, 0, 40),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
      },
      "entrance-5"
    );
    map.addTextToSVGPoint(
      {
        text: "№6",
        color: 0x104465,
        size: 40.0,
        position: new THREE.Vector3(0, 0, 40),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
      },
      "entrance-6"
    );
    map.addTextToSVGPoint(
      {
        text: "№7",
        color: 0x666666,
        size: 25.0,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        shadow: {
          castShadow: true,
          receiveShadow: true,
        },
      },
      "entrance-7"
    );
    /*map.addText({
      text: "Вход №2",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(-10, -50, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №3",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(360, -120, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №4",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(500, -80, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №1",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(-240, -50, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №6",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(-140, 180, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №5",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(150, 280, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    });
    map.addText({
      text: "Вход №7",
      color: 0x440000,
      size: 12.0,
      position: new THREE.Vector3(-500, -80, 40),
      rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    }); */
    console.log("Add Text Object", map.scenePublic);
  }
  function gotoURLClick(dataelement: any): void {
    console.log("gotoURLClick element = ", dataelement);
    //const geturl = dataelement.getAttribute('data-url')

    window.open(dataelement.slug, "_self");
  }
  return true;
}
