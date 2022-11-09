import type {
  DataInteractive,
  DataOptions,
  //MapTheme,
  BalloonTheme,
} from "./models/simple.models";
//import { SvgMap } from './_privatemodule/svg'
import Base from "./base";
//import { Scene } from "three";
import * as THREE from "three";
import { SVGLoader } from "./SVGLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { doc } from "prettier";
import { visitFunctionBody } from "typescript";

export class ClientSVG3D extends Base {
  node: any;
  dataItems: DataInteractive[] = [];
  options: DataOptions = {
    title: "",
    urlmap: "",
    stringSVG: "",
    interactiveLayer: "#interactive",
    isRemoveUnuseItem: false,
    isHoverEnable: true,
    funcParams: {},
    mapTheme: {
      colorBG: "#ffffff",
      colorItem: "#ff0000",
      colorHoverItem: "#34f05a",
      colorSelectItem: "#0000ff",
      opacityItem: 0.4,
      opacityHoverItem: 1,
      opacitySelectItem: 1,
      colorBorderItem: "#000000",
      colorBorderHoverItem: "#ffffff",
      colorBorderSelectItem: "#ffffff",
      isBorderItem: true,
      isBorderHoverItem: true,
      isBorderSelectItem: true,
      widthBorderItem: 2,
      widthBorderHoverItem: 2,
      widthBorderSelectItem: 2,
    },
    nodeCustomBalloon: null,
    dataStructureCustomBalloon: null,
    isMobileZoom: false,
    isSVGFromSring: false,
  };

  balloonTheme: BalloonTheme = {
    colorBG: "#ffffff",
    colorTitle: "#ff0000",
    colorDescription: "#34f05a",
    isPositionFixed: true,
    top: 10,
    left: 20,
  };

  isMobile: boolean | undefined;

  static evCache: unknown[] | undefined;
  static prevDiff = -1;
  static scrollEvent: unknown;
  static selectItem: unknown;
  currentZoom = 1;

  constructor(
    node: any,
    dataItems: DataInteractive[],
    options: DataOptions,
    // isMobile: boolean,
    balloonTheme: BalloonTheme
  ) {
    console.log("Input NODE = ", node);
    super();
    this.balloonTheme = balloonTheme;
    this.node = node;
    this.dataItems = dataItems;

    if (balloonTheme !== undefined) {
      this.balloonTheme = balloonTheme;
    }

    if (options !== undefined) {
      //this.options = options

      if (options.title !== undefined) {
        this.options.title = options.title;
      }
      if (options.urlmap !== undefined) {
        this.options.urlmap = options.urlmap;
      }
      if (options.stringSVG !== undefined) {
        this.options.stringSVG = options.stringSVG;
      }
      if (options.interactiveLayer !== undefined) {
        this.options.interactiveLayer = options.interactiveLayer;
      }
      if (options.isRemoveUnuseItem !== undefined) {
        this.options.isRemoveUnuseItem = options.isRemoveUnuseItem;
      }
      if (options.isHoverEnable !== undefined) {
        this.options.isHoverEnable = options.isHoverEnable;
      }
      if (options.funcClick !== undefined) {
        this.options.funcClick = options.funcClick;
      }
      if (options.funcParams !== undefined) {
        this.options.funcParams = options.funcParams;
      }

      if (options.nodeCustomBalloon !== undefined) {
        this.options.nodeCustomBalloon = options.nodeCustomBalloon;
      }
      if (options.dataStructureCustomBalloon !== undefined) {
        this.options.dataStructureCustomBalloon =
          options.dataStructureCustomBalloon;
      }
      if (options.isMobileZoom !== undefined) {
        this.options.isMobileZoom = options.isMobileZoom;
      }
      if (options.isSVGFromSring !== undefined) {
        this.options.isSVGFromSring = options.isSVGFromSring;
      }
      if (options.mapTheme !== undefined) {
        const mapTheme = this.options.mapTheme;
        if (options.mapTheme.colorBG !== undefined) {
          if (mapTheme) mapTheme.colorBG = options.mapTheme.colorBG;
        }

        if (options.mapTheme.colorItem !== undefined) {
          if (mapTheme) mapTheme.colorItem = options.mapTheme.colorItem;
        }
        if (options.mapTheme.colorHoverItem !== undefined) {
          if (mapTheme)
            mapTheme.colorHoverItem = options.mapTheme.colorHoverItem;
        }
        if (options.mapTheme.colorSelectItem !== undefined) {
          if (mapTheme)
            mapTheme.colorSelectItem = options.mapTheme.colorSelectItem;
        }
        if (options.mapTheme.opacityItem !== undefined) {
          if (mapTheme) mapTheme.opacityItem = options.mapTheme.opacityItem;
        }
        if (options.mapTheme.opacityHoverItem !== undefined) {
          if (mapTheme)
            mapTheme.opacityHoverItem = options.mapTheme.opacityHoverItem;
        }
        if (options.mapTheme.opacitySelectItem !== undefined) {
          if (mapTheme)
            mapTheme.opacitySelectItem = options.mapTheme.opacitySelectItem;
        }
        if (options.mapTheme.colorBorderItem !== undefined) {
          if (mapTheme)
            mapTheme.colorBorderItem = options.mapTheme.colorBorderItem;
        }
        if (options.mapTheme.colorBorderHoverItem !== undefined) {
          if (mapTheme)
            mapTheme.colorBorderHoverItem =
              options.mapTheme.colorBorderHoverItem;
        }
        if (options.mapTheme.colorBorderSelectItem !== undefined) {
          if (mapTheme)
            mapTheme.colorBorderSelectItem =
              options.mapTheme.colorBorderSelectItem;
        }
        if (options.mapTheme.isBorderItem !== undefined) {
          if (mapTheme) mapTheme.isBorderItem = options.mapTheme.isBorderItem;
        }
        if (options.mapTheme.isBorderHoverItem !== undefined) {
          if (mapTheme)
            mapTheme.isBorderHoverItem = options.mapTheme.isBorderHoverItem;
        }
        if (options.mapTheme.isBorderSelectItem !== undefined) {
          if (mapTheme)
            mapTheme.isBorderSelectItem = options.mapTheme.isBorderSelectItem;
        }
        if (options.mapTheme.widthBorderItem !== undefined) {
          if (mapTheme)
            mapTheme.widthBorderItem = options.mapTheme.widthBorderItem;
        }
        if (options.mapTheme.widthBorderHoverItem !== undefined) {
          if (mapTheme)
            mapTheme.widthBorderHoverItem =
              options.mapTheme.widthBorderHoverItem;
        }
        if (options.mapTheme.widthBorderSelectItem !== undefined) {
          if (mapTheme)
            mapTheme.widthBorderSelectItem =
              options.mapTheme.widthBorderSelectItem;
        }
      }
    }
  }
  static test(): boolean {
    return true;
  }

  start(): boolean {
    if (this.node === null || this.node === undefined) return false;
    this.isMobile = isMobile();
    const container = this.node;
    let INTERSECTED: any;
    const mouse = {
      x: 0,
      y: 0,
    };
    ClientSVG3D.evCache = [];
    console.log("START  = ", this.options?.title);
    console.log("Container  = ", container);

    const classOptions = this.options;
    if (classOptions && this.options?.urlmap !== "") {
      this.insertSVG(classOptions.urlmap);
    }
    console.log("container.clientWidth= ", container.clientWidth);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth - 10, container.clientHeight - 10);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, -1200, 1250);
    camera.lookAt(0, 100, 0);

    const scene = new THREE.Scene();
    const helper = new THREE.GridHelper(800, 10);
    helper.rotation.x = Math.PI / 2;
    scene.add(helper);
    scene.background = new THREE.Color(0xcccccc);
    /* const material = new THREE.LineBasicMaterial({
      color: 0xffff3f,
      linewidth: 14,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
    });
        const points = [];
    points.push(new THREE.Vector3(-500, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(300, 0, 0));
    points.push(new THREE.Vector3(410, 420, 0));
    points.push(new THREE.Vector3(0, 360, 0));
    points.push(new THREE.Vector3(-500, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line); */
    const vector = new THREE.Vector3(mouse.x, mouse.y, 1);

    const raycaster = new THREE.Raycaster(
      camera.position,
      vector.sub(camera.position).normalize()
    );
    const render = () => {
      /*       
      requestAnimationFrame(render);
*/
      // update the picking raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking raycaster
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        console.log("Object", intersects[0].object);
        // intersects[0].object.material.color.set(0xff0000);
      } else {
        material.color.set(0xbbbbbb);
      }

      renderer.render(scene, camera);
    };
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.screenSpacePanning = false;
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.enablePan = true;
    controls.enableRotate = false;
    controls.screenSpacePanning = true;

    controls.minDistance = 0;
    controls.maxDistance = 1000;

    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.2;
    controls.maxAzimuthAngle = Math.PI;
    controls.target = new THREE.Vector3(0, -100, 0);
    controls.update();
    scene.add(new THREE.AmbientLight(0xf0f0f0));
    const light = new THREE.SpotLight(0xffff44, 0.4);
    light.position.set(0, 0, 800);
    light.angle = -Math.PI * 0.52;
    light.castShadow = true;
    light.shadow.camera.near = 20;
    light.shadow.camera.far = 20000;
    light.shadow.bias = 0.000222;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.radius = 1.2;
    scene.add(light);

    const materialShadow = new THREE.ShadowMaterial();
    materialShadow.opacity = 0.4;
    const geometry = new THREE.PlaneGeometry(12000, 12000);
    //geometry.rotateX(-Math.PI / 0.001);
    const plane = new THREE.Mesh(geometry, materialShadow);
    plane.position.y = 200;
    plane.receiveShadow = true;
    scene.add(plane);
    const manager = new THREE.LoadingManager();
    const loader = new SVGLoader(manager);
    const fillColor = "#f2b679";
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setStyle(fillColor).convertSRGBToLinear(),
      opacity: 1,
      transparent: false,
      side: THREE.DoubleSide,
      depthWrite: false,
      wireframe: false,
    });

    loader.load(
      classOptions.urlmap,
      function (data: { paths: any }) {
        const paths = data.paths;
        console.log("    ## paths => ", data);
        //console.log("    ## paths => ", paths);
        const group = new THREE.Group();
        // group.scale.multiplyScalar(0.25);
        group.position.x = -850;
        group.position.y = 500;
        group.position.z = 30;
        group.scale.y *= -1;

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          if (fillColor !== undefined) {
            const materialM1 = new THREE.MeshLambertMaterial({
              color: new THREE.Color()
                .setStyle(fillColor)
                .convertSRGBToLinear(),
              opacity: 1,
              transparent: true,
              //side: THREE.DoubleSide,
              depthWrite: true,
              wireframe: false,
            });

            const depth = 30;
            const center = { x: 0, y: 0 };
            const shapes = SVGLoader.createShapes(path);
            //console.log("path => ", path);
            for (let j = 0; j < shapes.length; j++) {
              const shape = shapes[j];
              //const simpleShape = simpleShapes[j];
              const shape3d = new THREE.ExtrudeGeometry(shape, {
                depth: depth,
                bevelEnabled: false,
              });
              const geometry = new THREE.ShapeGeometry(shape);
              //const mesh = new THREE.Mesh(geometry, material);
              const mesh = new THREE.Mesh(shape3d, materialM1);
              //mesh.rotation.x = Math.PI;
              mesh.translateZ(-depth - 1);
              mesh.translateX(-center.x);
              mesh.translateY(-center.y);
              mesh.castShadow = true;
              mesh.name = "shop-" + i;
              group.add(mesh);
            }
          }

          const strokeColor = "#000000";

          if (strokeColor !== undefined) {
            const material = new THREE.MeshBasicMaterial({
              color: new THREE.Color()
                .setStyle(strokeColor)
                .convertSRGBToLinear(),
              opacity: 0.21,
              transparent: true,
              side: THREE.DoubleSide,
              depthWrite: false,
              wireframe: false,
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
              const subPath = path.subPaths[j];

              const geometry = SVGLoader.pointsToStroke(
                subPath.getPoints(),
                path.userData.style,
                90,
                1
              );

              if (geometry) {
                const mesh = new THREE.Mesh(geometry, material);

                group.add(mesh);
              }
            }
          }
          scene.add(group);

          render();
        }
      }, // called when loading is in progresses
      function (xhr: { loaded: number; total: number }) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error: any) {
        console.log("An error happened", error);
      }
    );

    document.addEventListener("mousemove", onDocumentMouseMove, false);

    function onDocumentMouseMove(event: { clientX: number; clientY: number }) {
      // the following line would stop any other event handler from firing
      // (such as the mouse's TrackballControls)
      // event.preventDefault();

      // update the mouse variable
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    renderer.render(scene, camera);

    this.node.style.backgroundColor = this.options?.mapTheme?.colorBG;
    this.node.style.overflow = "auto";
    //console.log('this.options!.isMobileZoom', this.options!.isMobileZoom)

    return true;
  }

  async insertSVG(urlSVG: string) {
    this.node.innerHTML = "";

    const getSVGData = await loadSVGFile(urlSVG);
    console.log("getSVGData = ", getSVGData);
  }
}

// create function load text file from url

const loadSVGFile = async (url: string) => {
  //  console.log('loadTextFromFile url = ', url)
  const data = fetch(url)
    .then((response) => response.text())
    .then((text) => {
      //  console.log('text = ', text)
      return text;
    })
    .catch((error) => {
      //  console.log('error = ', error)
      return error;
    });
  return data;
};

// write function chek  mobile device

const isMobile = () => {
  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor);
  return check;
};
