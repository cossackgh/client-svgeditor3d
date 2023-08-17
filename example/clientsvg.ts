import { ClientSVG3D } from "../src/clientSVG3D";
import {
  //DataInteractive,
  OptionsAmbientLight,
  OptionsCam,
  OptionsPlane,
  OptionsSpotLight,
} from "../src/models/simple.models";
import { dataShops2 } from "./dataItems";

import * as THREE from "three";
import { radToDeg } from "three/src/math/MathUtils";

export async function testmylib(): Promise<boolean> {
  console.log("testmylib");
  const nodeMap = document.getElementById("map3d");
  const nodeMap2 = document.getElementById("map3d2");
  const baloon = document.getElementById("baloon");
  let baloonTitle;
  if (baloon instanceof HTMLElement) {
    baloonTitle = baloon.querySelector(".baloon__title");
  }
  let arrayOldViewObject: string[] = [];
  const activeColorShop = 0xaa6666; // Color for active item
  const unactiveColorShop = 0x898888; // Color for active item
  const baloonTheme = {
    colorBG: "#eeeeee",
    colorTitle: "#000000",
    colorDescription: "#000000",
    isPositionFixed: false,
    top: 0,
    left: 0,
  };
  if (nodeMap2) {
    const map2: ClientSVG3D = new ClientSVG3D(
      nodeMap2, // node - dom element to insert svg
      dataShops2, // dataItems - data to render
      {
        isDebug: true, // isDebug - debug mode
        isHoverEnable: true, // isDebug - debug mode
        title: "Пример карты", // Head Title this map
        signsLayer: "#signsLayer", // Layer name for signs
        objectsLayer: "#objectsL", // Layer name for objects
        activeColor: activeColorShop, // Color for active item
        unactiveColor: unactiveColorShop, // Color for active item
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
    const paramCam2: OptionsCam = {};
    const targetCam2 = new THREE.Vector3(500, 0, 0);
    paramCam2.fov = 55;
    paramCam2.aspect = nodeMap2.offsetWidth / nodeMap2.offsetHeight;
    //paramCam.near = 1;
    paramCam2.far = 20000;
    paramCam2.zoom = 1.0;
    paramCam2.position?.set(3000, 0, 0);
    let paramAmbientLight: OptionsAmbientLight | undefined;
    let paramSpotLight: OptionsSpotLight | undefined;
    let paramPlane: OptionsPlane | undefined;

    //await startClient2();
    async function startClient2() {
      console.log("START MAP =>> ", map2);
      //nodeMap!.innerHTML = "";
      map2.options.urlmap = "./public/grand-floor-1-final.svg";
      map2.options.paramsMap = {
        positions: new THREE.Vector3(0, 0, 5),
        rotations: new THREE.Vector3(0, 0, 0),
        scales: new THREE.Vector3(0.5, 0.5, 1.0),
      };
      const startS = await map2.runLoadSVG();
      /* const startS = await map1.start();*/
      const initS = await map2.init();
      const initAnim = await map2.startAnimation();

      console.log("START MAP startS =>> ", startS);
      console.log("START MAP initS =>> ", initS);
      console.log("START MAP initAnim =>> ", initAnim);

      map2.addCamera(paramCam2);
      map2.addAmbientLight(paramAmbientLight);
      map2.addSpotLight(paramSpotLight);
      map2.addPlane(paramPlane);
      addTexts(map2);
      map2.addControlsNew({
        isZoom: true,
        isPan: true,
        isRotate: true,
        minDistance: 300,
        maxDistance: 1600,
        maxOrbitPanX: 400,
        maxOrbitPanY: 300,
        minOrbitPanX: -400,
        minOrbitPanY: -300,
        maxPolarAngle: Math.PI / 1.4,
        target: targetCam2,
        isUnmountEvent: false,
        minPolarAngle: 0
      });
      const objAtm = map2.addBox({
        nameBox: "sign-2",
        //urlSignImage: "./public/i-atm.png",
        width: 2000,
        height: 4300,
        depth: 0,
        position: new THREE.Vector3(1300, 600, 0),
        rotation: new THREE.Vector3(0, Math.PI / 1, 0),
        scale: new THREE.Vector3(100.0, 100.0, 100.0),
        material: new THREE.MeshPhongMaterial({
          color: 0x999999,
          specular: 0x666666,
          emissive: 0x000000,
          shininess: 6,
          opacity: 0.4,
          transparent: true,
          wireframe: false,
        }),
        shadow: {
          castShadow: false,
          receiveShadow: true,
        },
      });
      map2.setImageTexture(
        "./public/textures/grand-map-2.png",
        "./public/textures/alpha_texture.jpg",
        objAtm
      );
      const loadActive = await map2.addSVGExtrudeObject(
        {
          groupObjects: new THREE.Group(),
          settingsGroup: {
            nameGroup: "active",
            positions: new THREE.Vector3(
              -700,
              -220,
              map2.options.paramsMap?.positions?.z
            ),
            scales: new THREE.Vector3(0.5, 0.5, 0.5),
          },
          nameLayerSVG: "shops",
          settingsExtrude: {
            depth: 6,
            bevelEnabled: false,
          },
          shadow: {
            castShadow: true,
            receiveShadow: false,
          },
        },
        []
      );
    }

  }
  if (nodeMap) {
    const map1: ClientSVG3D = new ClientSVG3D(
      nodeMap, // node - dom element to insert svg
      dataShops2, // dataItems - data to render
      {
        isDebug: true, // isDebug - debug mode
        isHoverEnable: true, // isDebug - debug mode
        title: "Пример карты", // Head Title this map
        signsLayer: "#signsLayer", // Layer name for signs
        objectsLayer: "#objectsL", // Layer name for objects
        activeColor: activeColorShop, // Color for active item
        unactiveColor: unactiveColorShop, // Color for active item
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
    map1.onselectitem = (e): void => {
      //console.log("handler running");
      console.log("handler running", e);
      baloonTitle.innerHTML = e;
    };
    map1.onshowballoon = (e): void => {
      //console.log("handler running");
      //console.log("onshowballoon = ", e);
      if (e) {
        baloon?.classList.remove("hide");
      } else {
        baloon?.classList.add("hide");
      }
    };
    nodeMap.addEventListener("mousemove", (e) => {
      //console.log("handler running");
      /* console.log("handler running", e);
      console.log("baloon", baloon?.offsetHeight); */
      //MouseEvent;
      getMouseCursor(e);
      if (baloon instanceof HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //baloon!.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
        setTimeout(() => {
          baloon.style.left = `${e.pageX + 12}px`;
          baloon.style.top = `${e.pageY - baloon?.offsetHeight - 14}px`;
        }, 20);
      }
    });
    /* nodeMap.addEventListener("mouseover", () => {
      console.log("SHOW BALLOON");
      baloon?.classList.remove("hide");
    });
    nodeMap.addEventListener("mouseout", () => {
      console.log("HIDE BALLOON");
      baloon?.classList.add("hide");
    }); */
    const btnshclear = document.getElementById("clear");
    const btnsh1 = document.getElementById("viewShop1");
    const btnsh2 = document.getElementById("viewShop2");
    const btnsh3 = document.getElementById("viewShop3");
    const btnsign1 = document.getElementById("viewSign1");
    const btnsigns2 = document.getElementById("viewSigns2");
    const btnMap1 = document.getElementById("getMap1");
    const btnMap2 = document.getElementById("getMap2");
    const btnMap3 = document.getElementById("getMap3");
    const btnMap4 = document.getElementById("getMap4");
    const btnMap5 = document.getElementById("getMap5");
    const btnSelect1 = document.getElementById("selectObj1");
    const btnSelect2 = document.getElementById("selectObj2");
    const btnClearSelect = document.getElementById("clearSelection");
    btnshclear?.addEventListener("click", () => {
      clearSceneOnly();
    });
    btnsh1?.addEventListener("click", () => {
      viewSign([], true);
      selectShop("Shape-2-50");
    });
    btnsh2?.addEventListener("click", () => {
      viewSign([], true);
      selectShop("Shape-2-01");
    });
    btnsh3?.addEventListener("click", () => {
      viewSign([], true);
      selectShop("Shape-2-11");
    });
    btnsign1?.addEventListener("click", () => {
      clearSelectShop(map1);
      viewSign(["sign-point", "sign-point-2"], true);
    });
    btnsigns2?.addEventListener("click", () => {
      clearSelectShop(map1);
      viewSign(["sign-point-3"], true);
    });
    btnMap1?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap1.classList.add("active");
      selectMap("floor-1", ["Shape-2-50"]);
    });
    btnMap2?.addEventListener("click", () => {
      clearActiveFloor();
      btnMap2.classList.add("active");
      selectMap("floor-2", ["Shape-2-01", "Shape-2-11"]);
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
    btnSelect1?.addEventListener("click", () => {
      clearActiveFloor();
      btnSelect1.classList.add("active");
      selectObject(["sign-2", "sign-3"]);
    });
    btnSelect2?.addEventListener("click", () => {
      clearActiveFloor();
      clearSelectObject(map1);
      btnSelect2.classList.add("active");
      selectObject(["sign-1", "sign-3"]);
    });
    btnClearSelect?.addEventListener("click", () => {
      clearSelectObject(map1);
      btnClearSelect.classList.add("active");
    });

    function clearActiveFloor(): void {
      const btns = document.querySelectorAll(".btn__map_floor");
      btns.forEach((btn) => {
        btn.classList.remove("active");
      });
    }

    const paramCam: OptionsCam = {};
    const targetCam = new THREE.Vector3(0, 0, 0);
    paramCam.fov = 55;
    paramCam.aspect = nodeMap.offsetWidth / nodeMap.offsetHeight;
    //paramCam.near = 1;
    paramCam.far = 20000;
    paramCam.zoom = 1.0;
    paramCam.position?.set(3000, 0, 0);
    let paramAmbientLight: OptionsAmbientLight | undefined;
    let paramSpotLight: OptionsSpotLight | undefined;
    let paramPlane: OptionsPlane | undefined;

    await startClient();
    async function startClient() {
      console.log("START MAP =>> ", map1);
      //nodeMap!.innerHTML = "";

      const startS = await map1.runLoadSVG();
      /* const startS = await map1.start();*/
      const initS = await map1.init();
      const initAnim = await map1.startAnimation();

      console.log("START MAP startS =>> ", startS);
      console.log("START MAP initS =>> ", initS);
      console.log("START MAP initAnim =>> ", initAnim);

      map1.addCamera(paramCam);
      map1.addAmbientLight(paramAmbientLight);
      map1.addSpotLight(paramSpotLight);
      map1.addPlane(paramPlane);
      addTexts(map1);
      map1.addControls({
        isZoom: true,
        isPan: true,
        isRotate: false,
        minDistance: 300,
        maxDistance: 1600,
        maxOrbitPanX: 400,
        maxOrbitPanY: 300,
        minOrbitPanX: -400,
        minOrbitPanY: -300,
        maxPolarAngle: Math.PI / 1.4,
        target: targetCam,
        isUnmountEvent: false,
      });

      selectMap("floor-1");
    }

    /*const groupTree = new THREE.Group();
    groupTree.name = "building";
    groupTree.position.x = 0;
    groupTree.position.y = 0;
    groupTree.position.z = 0;
    selectMap("floor-1");
    console.log("START MAP =>> ", map1); */
    function clearSceneOnly(): void {
      if(nodeMap === null) return;
      nodeMap.innerHTML = "";
      map1.disposeTHREE();
    }
    function clearScene(): void {
      nodeMap!.innerHTML = "";
      map1.disposeTHREE();
      const paramCam: OptionsCam = {};
      const targetCam = new THREE.Vector3(0, 0, 0);
      //map1.start();
      map1.init();
      //paramCam.fov = 55;
      paramCam.aspect = nodeMap!.offsetWidth / nodeMap!.offsetHeight;
      //paramCam.near = 1;
      paramCam.far = 20000;
      paramCam.zoom = 1.0;
      paramCam.position?.set(3000, 0, 0);
      let paramAmbientLight: OptionsAmbientLight | undefined;
      let paramSpotLight: OptionsSpotLight | undefined;
      let paramPlane: OptionsPlane | undefined;
      map1.addCamera(paramCam);
      map1.addAmbientLight(paramAmbientLight);
      map1.addSpotLight(paramSpotLight);
      map1.addPlane(paramPlane);
      addTexts(map1);
      map1.addControls({
        isZoom: true,
        isPan: true,
        isRotate: false,
        minDistance: 300,
        maxDistance: 1600,
        maxOrbitPanX: 400,
        maxOrbitPanY: 300,
        minOrbitPanX: -400,
        minOrbitPanY: -300,
        maxPolarAngle: Math.PI / 1.4,
        target: targetCam,
        isUnmountEvent: true,
      });
      selectMap("floor-1");
    }
    function selectShop(dataelement: any): void {
      console.log("selectShop element = ", dataelement);
      //const geturl = dataelement.getAttribute('data-url')

      map1.selectItem(dataelement, true);
    }
    function selectObject(idObject: string[]): void {
      console.log("selectObject element = ", idObject);
      //const geturl = dataelement.getAttribute('data-url')
      map1.selectObject(
        idObject,
        map1.options?.signsLayer?.substring(1) as string,
        false
      );
    }
    function viewSign(idObjects: string[], isVisible: boolean): void {
      console.log("selectObject element = ", idObjects);
      map1.visibleObjects(arrayOldViewObject, false);
      map1.visibleObjects(idObjects, isVisible);
      arrayOldViewObject = idObjects;
    }
    async function selectMap(
      floorMap: any,
      selectItem: string[] = []
    ): Promise<void> {
      console.log("selectMap element = ", floorMap);
      console.log("selectMap scenePublic = ", map1.scenePublic);
      //const geturl = dataelement.getAttribute('data-url')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //nodeMap!.innerHTML = "";
      const objectDeleted = map1.scenePublic?.getObjectByProperty(
        "name",
        "rootMap"
      );
      switch (floorMap) {
        case "floor-1":
          console.log("objectDeleted =>> ", objectDeleted);
          map1.clearAnimationArray();
          if (objectDeleted !== undefined) map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-1-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 5),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          const startS = await map1.runLoadSVG();
          addWall(map1, "floor-1");
          addFloor(map1, "floor-1");
          /* map1.addSign({
            nameSign: "sign-1",
            urlSignImage: "./public/i-atm.png",
            position: new THREE.Vector3(420, 1200, 260),
            rotation: new THREE.Vector3(0, Math.PI / 1, Math.PI / 1),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x312100,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.5,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: false,
            },
          }); */
          const objAtm = map1.addBox({
            nameBox: "sign-2",
            //urlSignImage: "./public/i-atm.png",
            width: 2000,
            height: 4300,
            depth: 0,
            position: new THREE.Vector3(1300, 600, 0),
            rotation: new THREE.Vector3(0, Math.PI / 1, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.4,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: true,
            },
          });
          map1.setImageTexture(
            "./public/textures/grand-map-2.png",
            "./public/textures/alpha_texture.jpg",
            objAtm
          );
          console.log("objAtm =>> ", objAtm);
          /*const loadObjAnim = await map1.addFBX({
            urlOBJ: "./public/3dobj/lift.fbx",
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            //rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(10, 20, 10),
            position: new THREE.Vector3(600, 400, 60),
            //isAnimation: true,
          });
          console.log("loadObjAnim =>> ", loadObjAnim); */

          /* const loadObjAnim1 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/flamingo.glb",
            nameObject: "Flamingo",
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            durationAnimation: 2,
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(0.4, 0.4, 0.4),
            position: new THREE.Vector3(1300, 830, 200),
            //isAnimation: true,
          }); */
          const findWC1 = map1.getPositionSVGObject("wc-1-1");

          console.log("START MAP startS findElement =>> ", findWC1);
          const signPoint = await map1.addGLB2({
            urlOBJ: "./public/3dobj/signPoint.glb",
            nameObject: "sign-point",
            rotation: new THREE.Vector3(degToRad(90), degToRad(0), degToRad(0)),
            scale: new THREE.Vector3(10, 10, 10),
            position: new THREE.Vector3(findWC1?.x, findWC1?.y, 6),
            isVisible: false,
          });

          map1.setMaterialsParams(signPoint, {
            color: 0x9823ab,
            opacity: 0.5,
            transparent: true,
          });
          const findWC2 = map1.getPositionSVGObject("wc-1-2");
          const signPoint2 = map1.addClone({
            meshSource: signPoint,
            name: "sign-point-2",
            duration: 6,
            //position: new THREE.Vector3(880, 430, 10),
            position: new THREE.Vector3(findWC2?.x, findWC2?.y, 10),
          });
          const signPoint3 = map1.addClone({
            meshSource: signPoint,
            name: "sign-point-3",
            duration: 6,
            position: new THREE.Vector3(1720, 770, 10),
          });
          const liftf1 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/lift-bl2.glb",
            nameObject: "lift-1",
            durationAnimation: 6,
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(8, 8, 8),
            position: new THREE.Vector3(1500, 830, 10),
            //isAnimation: true,
          });

          //const getObj = map1.findObjectByName("Flamingo");

          map1.addClone({
            meshSource: liftf1,
            name: "lift-2",
            duration: 6,
            position: new THREE.Vector3(2100, 830, 10),
          });
          map1.addClone({
            meshSource: liftf1,
            name: "lift-3",
            duration: 6,
            position: new THREE.Vector3(1250, 380, 10),
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1, 0),
          });
          map1.addClone({
            meshSource: liftf1,
            name: "lift-4",
            duration: 6,
            position: new THREE.Vector3(1970, 450, 10),
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
          });
          map1.addClone({
            meshSource: liftf1,
            name: "lift-5",
            duration: 6,
            position: new THREE.Vector3(2055, 535, 10),
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 3.3, 0),
          });
          const LiftShahta1 = map1.addBox({
            nameBox: "signOp-1",
            width: 25,
            height: 25,
            depth: 300,
            position: new THREE.Vector3(1970, 450, 60),
            rotation: new THREE.Vector3(0, Math.PI / 1, degToRad(50)),
            material: new THREE.MeshPhongMaterial({
              color: 0x33dddd,
              specular: 0x666666,
              //emissive: 0x777777,
              shininess: 6,
              opacity: 0.2,
              transparent: true,
              depthWrite: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: false,
            },
          });
          const LiftShahta2 = map1.addBox({
            nameBox: "signOp-1",
            width: 25,
            height: 25,
            depth: 300,
            position: new THREE.Vector3(2055, 535, 60),
            rotation: new THREE.Vector3(0, Math.PI / 1, degToRad(50)),
            material: new THREE.MeshPhongMaterial({
              color: 0x33dddd,
              specular: 0x666666,
              //emissive: 0x777777,
              shininess: 6,
              opacity: 0.2,
              transparent: true,
              depthWrite: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: false,
            },
          });
          const treeObj1f = await map1.addObject({
            nameObject: "tree-01",
            urlOBJ: "./public/3dobj/tree-1.obj",
            urlMTL: "./public/3dobj/tree-2.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
            scale: new THREE.Vector3(3.0, 3.0, 3.0),
            position: new THREE.Vector3(1100, 430, 0),
          });
          console.log("treeObj =>> ", treeObj1f);
          map1.addClone({
            meshSource: treeObj1f,
            name: "tree-02",
            position: new THREE.Vector3(70, 150, 0),
          });
          map1.addClone({
            meshSource: treeObj1f,
            name: "tree-03",
            position: new THREE.Vector3(150, 290, 0),
          });

          const objLine = new THREE.Group();
          objLine.name = "line-4511";
          const cafe1 = await map1.addObject({
            nameObject: "cafe-01",
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            position: new THREE.Vector3(470, 390, 10),
          });
          const cafe2 = await map1.addObject({
            nameObject: "cafe-01",
            urlOBJ: "./public/3dobj/obj/cafe.obj",
            urlMTL: "./public/3dobj/obj/cafe.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 2, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            position: new THREE.Vector3(1820, 660, 7),
          });
          const car1 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/ferrari.glb",
            nameObject: "car-01",
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            durationAnimation: 4,
            rotation: new THREE.Vector3(
              degToRad(90),
              degToRad(30),
              degToRad(0)
            ),
            scale: new THREE.Vector3(20, 20, 20),
            position: new THREE.Vector3(1300, 230, 0),
            color: 0x660000,
          });
          map1.setMaterialsParams(car1, {
            color: 0x006655,
            opacity: 0.7,
            transparent: true,
          });

          const boxMesh = map1.addBox({
            nameBox: "box-3521",
            width: 20,
            height: 50,
            depth: 20,
            position: new THREE.Vector3(1300, 230, 60),
            rotation: new THREE.Vector3(0, 0, 0),
            material: new THREE.MeshPhongMaterial({
              color: 0x005500,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.8,
              transparent: true,
              wireframe: false,
            }),
          });
          const pathM = [
            new THREE.Vector2(440, 980),
            new THREE.Vector2(440, 920),
            new THREE.Vector2(1300, 920),
            new THREE.Vector2(1500, 920),
            new THREE.Vector2(1300, 920),
            new THREE.Vector2(440, 920),
            new THREE.Vector2(440, 980),
          ];
          const pathM3 = [
            new THREE.Vector2(1440, 980),
            new THREE.Vector2(1440, 920),
            new THREE.Vector2(2200, 920),
            new THREE.Vector2(2400, 980),
            new THREE.Vector2(2400, 1000),
            new THREE.Vector2(2000, 1200),
            new THREE.Vector2(1800, 1100),
            new THREE.Vector2(1440, 980),
          ];
          const pathM4 = [
            new THREE.Vector3(1440, 980, 50),
            new THREE.Vector3(1440, 920, 50),
            new THREE.Vector3(2200, 920, 50),
            new THREE.Vector3(2400, 980, 90),
            new THREE.Vector3(2400, 1000, 220),
            new THREE.Vector3(2000, 1200, 90),
            new THREE.Vector3(1800, 1100, 70),
            new THREE.Vector3(1440, 980, 50),
          ];
          const findWC2A = map1.getPositionSVGObject("wc-1-1");
          const pathM5 = [
            new THREE.Vector3(findWC2A?.x, findWC2A?.y, 6),
            new THREE.Vector3(findWC2A?.x, findWC2A?.y, 10),
            new THREE.Vector3(findWC2A?.x, findWC2A?.y, 50),
            new THREE.Vector3(findWC2A?.x, findWC2A?.y, 6),
          ];
          const pathM6 = [
            new THREE.Vector3(findWC2?.x, findWC2?.y, 6),
            new THREE.Vector3(findWC2?.x, findWC2?.y, 10),
            new THREE.Vector3(findWC2?.x, findWC2?.y, 50),
            new THREE.Vector3(findWC2?.x, findWC2?.y, 6),
          ];

          map1.addObjectToAnimate({
            isPathAnimation: true,
            namePath: "carmovie",
            object: boxMesh,
            path: map1.createAnimationPath(pathM4),
            t: 0,
            duration: 18,
          });
          map1.addObjectToAnimate({
            isOpacityAnimation: false,
            isPathAnimation: true,
            namePath: "signmovie",
            object: signPoint2,
            path: map1.createAnimationPath(pathM5),
            t: 0,
            duration: 2,
          });
          map1.addObjectToAnimate({
            isOpacityAnimation: false,
            isPathAnimation: true,
            namePath: "signmovie1",
            object: signPoint,
            path: map1.createAnimationPath(pathM6),
            t: 0,
            duration: 2,
          });
          /* map1.addObjectToAnimate({
            isOpacityAnimation: true,
            object: signPoint2,
            t: 0,
            tt: 0,
            duration: 3,
            opacitySteps: {
              timeStart: 0.5,
              timeEnd: 0.5,
            },
          });
          map1.addObjectToAnimate({
            isOpacityAnimation: true,
            namePath: "sign-point-animation",
            object: signPoint,
            t: 0,
            tt: 0,
            duration: 3,
            opacitySteps: {
              timeStart: 0.5,
              timeEnd: 0.5,
            },
          }); */

          map1.addClone({
            meshSource: car1,
            name: "car-02",
            position: new THREE.Vector3(1600, 230, 0),
          });
          const video = document.getElementById("video");
          const video2 = document.getElementById("video2");
          /* const videoBoxGround = map1.addBoxVideoTextire(
            video2 as HTMLVideoElement,
            {
              nameBox: "box-VIDEO-ground",
              width: 2600,
              height: 1200,
              depth: 2,
              position: new THREE.Vector3(1300, 675, 0),
              rotation: new THREE.Vector3(0, 0, 0),
            }
          ); */
          /* const videoBox = map1.addBoxVideoTextire(video as HTMLVideoElement, {
            nameBox: "box-VIDEO-2",
            width: 500,
            height: 50,
            depth: 2,
            position: new THREE.Vector3(500, 30, 0),
            rotation: new THREE.Vector3(0, 0, 0),
          }); 
          
          map1.addClone({
            meshSource: videoBox,
            name: "box-VIDEO-3",
            position: new THREE.Vector3(1000, 30, 0),
          });
          map1.addClone({
            meshSource: videoBox,
            name: "box-VIDEO-4",
            position: new THREE.Vector3(1500, 30, 0),
          });
          map1.addClone({
            meshSource: videoBox,
            name: "box-VIDEO-5",
            position: new THREE.Vector3(2000, 30, 0),
          });
          map1.addClone({
            meshSource: videoBox,
            name: "box-VIDEO-6",
            position: new THREE.Vector3(2500, 30, 0),
          });
          map1.addClone({
            meshSource: videoBox,
            name: "box-VIDEO-7",
            position: new THREE.Vector3(930, 250, -1),
            rotation: new THREE.Vector3(degToRad(0), degToRad(0), degToRad(60)),
          });
*/
          console.log("SELECT MAP 1 =>> ", map1);
          break;
        case "floor-2":
          map1.clearAnimationArray();
          map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-2-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 35),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          await map1.runLoadSVG();
          addWall(map1, "floor-2");
          addFloor(map1, "floor-2");
          const objAtmf2 = map1.addBox({
            nameBox: "sign-2",
            //urlSignImage: "./public/i-atm.png",
            width: 2000,
            height: 4300,
            depth: 0,
            position: new THREE.Vector3(1300, 600, 0),
            rotation: new THREE.Vector3(0, Math.PI / 1, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.4,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: true,
            },
          });
          map1.setImageTexture(
            "./public/textures/grand-map-2.png",
            "./public/textures/alpha_texture.jpg",
            objAtmf2
          );
          const liftf2 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/lift-bl2.glb",
            nameObject: "lift-1",
            durationAnimation: 6,
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(8, 8, 8),
            position: new THREE.Vector3(1500, 830, 10),
            //isAnimation: true,
          });

          map1.addClone({
            meshSource: liftf2,
            name: "lift-2",
            duration: 6,
            position: new THREE.Vector3(2100, 830, 10),
          });
          map1.addClone({
            meshSource: liftf2,
            name: "lift-3",
            duration: 6,
            position: new THREE.Vector3(1250, 380, 10),
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 1, 0),
          });
          map1.addClone({
            meshSource: liftf2,
            name: "lift-4",
            duration: 6,
            position: new THREE.Vector3(1970, 450, 10),
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
          });
          map1.addClone({
            meshSource: liftf2,
            name: "lift-5",
            duration: 6,
            position: new THREE.Vector3(2055, 535, 10),
            rotation: new THREE.Vector3(Math.PI / 2, -Math.PI / 3.3, 0),
          });
          const treeObj2f = await map1.addObject({
            nameObject: "tree-01",
            urlOBJ: "./public/3dobj/tree-1.obj",
            urlMTL: "./public/3dobj/tree-2.mtl",
            rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 4, 0),
            scale: new THREE.Vector3(3.0, 3.0, 3.0),
            position: new THREE.Vector3(1100, 430, 0),
          });
          console.log("treeObj =>> ", treeObj2f);
          map1.addClone({
            meshSource: treeObj2f,
            name: "tree-02",
            position: new THREE.Vector3(70, 150, 0),
          });
          map1.addClone({
            meshSource: treeObj2f,
            name: "tree-03",
            position: new THREE.Vector3(150, 290, 0),
          });
          const car21 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/ferrari.glb",
            nameObject: "car-01",
            //color: 0x850000,
            //urlMTL: "./public/3dobj/car-2.mtl",
            durationAnimation: 4,
            rotation: new THREE.Vector3(Math.PI / 2, 0.38, 0),
            scale: new THREE.Vector3(20, 20, 20),
            position: new THREE.Vector3(1300, 230, 0),
          });
          map1.addClone({
            meshSource: car21,
            name: "car-02",
            position: new THREE.Vector3(1600, 230, 0),
          });
          console.log("SELECT MAP 2 =>> ", map1);
          const findWC12 = map1.getPositionSVGObject("wc-1-1");

          console.log("START MAP startS findElement findWC12 =>> ", findWC12);
          const signPoint22 = await map1.addGLB2({
            urlOBJ: "./public/3dobj/signPoint.glb",
            nameObject: "sign-point",
            rotation: new THREE.Vector3(degToRad(90), degToRad(0), degToRad(0)),
            scale: new THREE.Vector3(10, 10, 10),
            position: new THREE.Vector3(findWC12?.x, findWC12?.y, 36),
            isVisible: false,
          });
          map1.addObjectToAnimate({
            isOpacityAnimation: true,
            namePath: "sign-point-animation",
            object: signPoint22,
            t: 0,
            tt: 0,
            duration: 3,
            opacitySteps: {
              timeStart: 0.5,
              timeEnd: 0.5,
            },
          });
          map1.setMaterialsParams(signPoint22, {
            color: 0x9823ab,
            opacity: 0.5,
            transparent: true,
          });
          const findWC22 = map1.getPositionSVGObject("wc-1-2");
          const signPoint222 = map1.addClone({
            meshSource: signPoint22,
            name: "sign-point-2",
            duration: 6,
            //position: new THREE.Vector3(880, 430, 10),
            position: new THREE.Vector3(findWC22?.x, findWC22?.y, 30),
          });
          const signPoint32 = map1.addClone({
            meshSource: signPoint22,
            name: "sign-point-3",
            duration: 6,
            position: new THREE.Vector3(1720, 770, 30),
          });

          break;
        case "floor-3":
          map1.clearAnimationArray();
          map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-3-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 65),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          await map1.runLoadSVG();
          addWall(map1, "floor-3");
          addFloor(map1, "floor-3");
          const objAtmf3 = map1.addBox({
            nameBox: "sign-2",
            //urlSignImage: "./public/i-atm.png",
            width: 2000,
            height: 4300,
            depth: 0,
            position: new THREE.Vector3(1300, 600, 0),
            rotation: new THREE.Vector3(0, Math.PI / 1, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.4,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: true,
            },
          });
          map1.setImageTexture(
            "./public/textures/grand-map-2.png",
            "./public/textures/alpha_texture.jpg",
            objAtmf3
          );
          addRoof(map1, "floor-3");
          break;
        case "floor-4":
          map1.clearAnimationArray();
          map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-4-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 95),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          await map1.runLoadSVG();
          addWall(map1, "floor-4");
          addFloor(map1, "floor-4");
          const objAtmf4 = map1.addBox({
            nameBox: "sign-2",
            width: 2000,
            height: 4300,
            depth: 0,
            position: new THREE.Vector3(1300, 600, 0),
            rotation: new THREE.Vector3(0, Math.PI / 1, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.4,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: true,
            },
          });
          map1.setImageTexture(
            "./public/textures/grand-map-2.png",
            "./public/textures/alpha_texture.jpg",
            objAtmf4
          );
          addRoof(map1, "floor-4");
          break;
        case "floor-5":
          map1.clearAnimationArray();
          map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-5-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 120),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          await map1.runLoadSVG();
          addWall(map1, "floor-5");
          addFloor(map1, "floor-5");
          const objAtmf5 = map1.addBox({
            nameBox: "sign-2",
            width: 2000,
            height: 4300,
            depth: 0,
            position: new THREE.Vector3(1300, 600, 0),
            rotation: new THREE.Vector3(0, Math.PI / 1, 0),
            scale: new THREE.Vector3(100.0, 100.0, 100.0),
            material: new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x666666,
              emissive: 0x000000,
              shininess: 6,
              opacity: 0.4,
              transparent: true,
              wireframe: false,
            }),
            shadow: {
              castShadow: false,
              receiveShadow: true,
            },
          });
          map1.setImageTexture(
            "./public/textures/grand-map-2.png",
            "./public/textures/alpha_texture.jpg",
            objAtmf5
          );
          addRoof(map1, "floor-5");
          break;
        case "floor-0":
          map1.clearThree(objectDeleted);
          map1.options.urlmap = "./public/grand-floor-0-final.svg";
          map1.options.paramsMap = {
            positions: new THREE.Vector3(0, 0, 95),
            rotations: new THREE.Vector3(0, 0, 0),
            scales: new THREE.Vector3(0.5, 0.5, 1.0),
          };
          await map1.runLoadSVG();
          addWall(map1, "floor-0");
          addFloor(map1, "floor-0");
          break;
        default:
          break;
      }
      console.log("SELECT MAP  =>> ", map1);
      const loadActive = await map1.addSVGExtrudeObject(
        {
          groupObjects: new THREE.Group(),
          settingsGroup: {
            nameGroup: "active",
            positions: new THREE.Vector3(
              -700,
              -220,
              map1.options.paramsMap?.positions?.z
            ),
            scales: new THREE.Vector3(0.5, 0.5, 0.5),
          },
          nameLayerSVG: "shops",
          settingsExtrude: {
            depth: 6,
            bevelEnabled: false,
          },
          /* material: new THREE.MeshPhongMaterial({
            color: unactiveColorShop,
            //specular: 0x222222,
            //emissive: 0x777777,
            //shininess: 6,
            transparent: false,
            wireframe: false,
            depthWrite: false,
          }), */
          shadow: {
            castShadow: true,
            receiveShadow: false,
          },
        },
        selectItem
      );
      console.log("loadActive =>> ", loadActive);
      console.log("Scene Public =>> ", map1.scenePublic);
      /*let paramCam: OptionsCam | undefined;
      let paramAmbientLight: OptionsAmbientLight | undefined;
      let paramSpotLight: OptionsSpotLight | undefined;
      let paramPlane: OptionsPlane | undefined;
      map1.addCamera(paramCam);
      map1.addAmbientLight(paramAmbientLight);
      map1.addSpotLight(paramSpotLight);
      map1.addPlane(paramPlane);
      addTexts(map1);
      const loadObj = await map1.addObject({
        urlOBJ: "./public/3dobj/car-2.obj",
        color: 0x850000,
        //urlMTL: "./public/3dobj/car-2.mtl",
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(0.2, 0.2, 0.2),
        position: new THREE.Vector3(550, 60, 6),
        isAnimation: true,
      }); */
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
        zPozitions = 1;
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
        zPozitions = 1;
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
        color: 0x989899,
        specular: 0x222222,
        //emissive: 0x777777,
        shininess: 6,
        opacity: 1.0,
        transparent: false,
        wireframe: false,
        //depthWrite: false,
      }),
      shadow: {
        castShadow: true,
        receiveShadow: false,
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
        positions: new THREE.Vector3(0, 0, 6),
      },
      nameLayerSVG: "wall",
      settingsExtrude: {
        depth: wallHeight,
        bevelEnabled: false,
      },
      material: new THREE.MeshPhongMaterial({
        color: 0x115281,
        specular: 0x666666,
        //emissive: 0x777777,
        shininess: 1,
        opacity: 0.2,
        transparent: true,
        wireframe: false,
        side: THREE.DoubleSide,
        //depthWrite: false,
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
        font: "./public/fonts/Roboto_Bold.json",
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
    console.log("Add Text Object", map.scenePublic);
  }
  function clearSelectObject(map: ClientSVG3D): void {
    map.clearSelectObject(map.options?.signsLayer?.substring(1) as string);
  }
  function clearSelectShop(map: ClientSVG3D) {
    map.clearColorActive();
  }
  function degToRad(degrees: number): number {
    const radians = (degrees * Math.PI) / 180;
    return radians;
  }
  function gotoURLClick(dataelement: any): void {
    console.log("gotoURLClick element = ", dataelement);
    //const geturl = dataelement.getAttribute('data-url')

    window.open(dataelement.slug, "_self");
  }
  function getMouseCursor(event: any): void {
    const x = event.clientX;
    const y = event.clientY;
    const coords = "X coords: " + x + ", Y coords: " + y;
    console.log("getMouseCursor = ", coords);
  }
  return true;
}
