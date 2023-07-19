/**
 * @description
 * Interface for simple model Items  @DataInteractive
 * @id {string} ID of the item
 * @idmap {string} Id item on the map
 * @title {string} Title of the item
 * @slug {string;} Slug of the item
 * @description {string} Description of the item
 * @image {string}  Image url of the item
 */
export interface DataInteractive {
  id?: string;
  idmap?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
}

/**
 * @description
 * This is the description of the interface @DataOptions
 * @title {string} Заголовок
 * @colorBG {string} Цвет фона карты
 * @urlmap {string} Путь к файлу карты
 * @interactiveLayer {string}
 * @description {string}
 * @image  {string}
 * @isRemoveUnuseItem {boolean}
 * @funcClick {function}
 * @funcParams {any}
 * @mapTheme {MapTheme}
 */
export interface DataOptions {
  isDebug?: boolean;
  title?: string;
  colorBG?: string;
  urlmap?: string;
  stringSVG?: string;
  activeColor?: string | number;
  unactiveColor?: string | number;
  interactiveLayer?: string;
  objectsLayer?: string;
  signsLayer?: string;
  isRemoveUnuseItem?: boolean;
  isHoverEnable?: boolean;
  isAnimate?: boolean;
  funcClick?: () => void;
  funcParams?: any;
  paramsMap?: ParamsMap;
}

/**
 * @description
 * This is the description of the interface @BalloonOptions
 * @title {string} title - This is the title of the interface
 * @description {string} description - This is the description of the interface
 * @image {string} image - This is the image of the interface
 * @balloonTheme  {BalloonTheme}
 */
export interface BalloonOptions {
  title?: string;
  description?: string;
  image?: string;
  balloonTheme: BalloonTheme;
}

/**
 * @description
 * This is the description of the interface @CastomBalloonOptions
 * @title {string} title - This is the title of the interface
 * @description {string} description - This is the description of the interface
 */
export interface CastomBalloonOptions {
  title?: string;
  description?: string;
}

/**
 * @description
 * This is the description of the interface @BalloonTheme
 * @colorBG {string} colorBG - This is the colorBG of the Balloon
 * @colorTitle {string} colorTitle - This is the colorTitle of the Balloon
 * @colorDescription {string} colorDescription - This is the colorDescription of the Balloon
 * @isPositionFixed {boolean} isPositionFixed - This is the use of the Balloon fixed position
 * @top {number}  top - This is the top positon of the Balloon
 * @left {number} left - This is the left position of the Balloon
 */
export interface BalloonTheme {
  colorBG?: string;
  colorTitle?: string;
  colorDescription?: string;
  isPositionFixed?: boolean;
  top?: number;
  left?: number;
}

/**
 * @description
 * This is the description of the interface @MapTheme
 * @colorBG {string} colorBG - This is the colorBG of the Map
 * @colorItem {string} colorItem - This is the colorItem of the Map
 * @colorHoverItem {string} colorHoverItem - This is the colorHoverItem of the Map
 * @colorSelectItem {string} colorSelectItem - This is the colorSelectItem of the Map
 * @opacityItem {number} opacityItem - This is the opacityItem of the Map
 * @opacityHoverItem {number} opacityHoverItem - This is the opacityHoverItem of the Map
 * @opacitySelectItem {number} opacitySelectItem - This is the opacitySelectItem of the Map
 * @colorBorderItem {string} colorBorderItem - This is the colorBorderItem of the Map
 * @colorBorderHoverItem {string} colorBorderHoverItem - This is the colorBorderHoverItem of the Map
 * @colorBorderSelectItem {string} colorBorderSelectItem - This is the colorBorderSelectItem of the Map
 * @isBorderItem {boolean} isBorderItem - This is the use of the borderItem of the Map
 * @isBorderHoverItem {boolean} isBorderHoverItem - This is the use of the borderHoverItem of the Map
 * @isBorderSelectItem {boolean} isBorderSelectItem - This is the use of the borderSelectItem of the Map
 * @widthBorderItem {number} widthBorderItem - This is the widthBorderItem of the Map
 * @widthBorderHoverItem {number} widthBorderHoverItem - This is the widthBorderHoverItem of the Map
 * @widthBorderSelectItem {number} widthBorderSelectItem - This is the widthBorderSelectItem of the Map
 *
 */
export interface MapTheme {
  colorBG?: string;
  colorItem?: string;
  colorHoverItem?: string;
  colorSelectItem?: string;
  opacityItem?: number;
  opacityHoverItem?: number;
  opacitySelectItem?: number;
  colorBorderItem?: string;
  colorBorderHoverItem?: string;
  colorBorderSelectItem?: string;
  isBorderItem?: boolean;
  isBorderHoverItem?: boolean;
  isBorderSelectItem?: boolean;
  widthBorderItem?: number;
  widthBorderHoverItem?: number;
  widthBorderSelectItem?: number;
}
export interface LoadObject {
  nameLayer?: string;
  nameObject?: string;
  urlMTL?: string;
  urlOBJ: string;
  color?: string | number;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  positionGroup?: THREE.Vector3;
  rotationGroup?: THREE.Vector3;
  scaleGroup?: THREE.Vector3;
  isAnimation?: boolean;
  durationAnimation?: number;
  clipAnimation?: number;
  isLoopAnimation?: boolean;
  pathAnimation?: string;
}
export interface CloneObject {
  meshSource: any;
  name?: string;
  clip?: any;
  speed?: number;
  duration?: number;
  position: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
}
export interface ParamsMap {
  positions?: THREE.Vector3;
  rotations?: THREE.Vector3;
  scales?: THREE.Vector3;
}
export interface GroupSettings {
  positions?: THREE.Vector3;
  rotations?: THREE.Vector3;
  scales?: THREE.Vector3;
  nameGroup?: string;
}
export interface ExtrudeSettings {
  steps?: number;
  depth: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
}
export interface OptionsExtrudeObject {
  groupObjects: THREE.Group;
  settingsGroup?: GroupSettings;
  nameLayerSVG?: string;
  settingsExtrude?: ExtrudeSettings;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}

export interface ParametersStart {
  layaerActive?: string;
}
export interface TubeOptions {
  nameLine?: string;
  points?: THREE.Vector3[];
  nameGroupInsert?: string;
  color?: string | number;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  tubularSegments?: number;
  radius?: number;
  radiusSegments?: number;
  curveClosed?: boolean;
  curveType?: string;
  curveTension?: number;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface PolylineOptions {
  nameLine?: string;
  points?: THREE.Vector3[];
  nameGroupInsert?: string;
  color?: string | number;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  thin?: number;
  isDash?: boolean;
  isAnimation?: boolean;
  isLoopAnimation?: boolean;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface TextOptions {
  nameTextObject?: string;
  text?: string;
  color?: string | number;
  size?: number;
  font?: string;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  isAnimation?: boolean;
  isLoopAnimation?: boolean;
  pathAnimation?: string;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface OptionsAnimationStep {
  colorKeys?: string[] | number[];
  colorSteps?: string[] | number[];
  opacityKeys?: string[] | number[];
  opacitySteps?: string[] | number[];
  positionKeys?: number[];
  positionSteps?: number[];
  rotationKeys?: number[];
  rotationSteps?: number[];
  scaleKeys?: number[];
  scaleSteps?: number[];
  numberOfSteps?: number;
  isAnimation?: boolean;
  isLoopAnimation?: boolean;
  pathAnimation?: string;
}

export interface OptionsPlane {
  material?: THREE.ShadowMaterial;
  position?: THREE.Vector3;
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface OptionsCam {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  zoom?: number;
  position?: THREE.Vector3;
}
export interface OptionsAmbientLight {
  name?: string;
  color?: THREE.ColorRepresentation | undefined;
  intensity?: number | undefined;
}
export interface SphereParams {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface CylinderParams {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface BoxParams {
  nameBox?: string;
  namegroup?: string;
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  materialsSide?: BoxSideTextures;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface SignOptions {
  nameSign?: string;
  width?: number;
  height?: number;
  depth?: number;
  urlSignImage?: string;
  material?:
    | THREE.MeshBasicMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshPhongMaterial;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  scale?: THREE.Vector3;
  shadow?: {
    castShadow?: boolean;
    receiveShadow?: boolean;
  };
}
export interface BoxSideTextures {
  front?: string;
  back?: string;
  up?: string;
  down?: string;
  left?: string;
  right?: string;
}
export interface AnimationOptions {
  isPathAnimation?: boolean;
  isOpacityAnimation?: boolean;
  namePath?: string;
  path?: THREE.Path | THREE.CatmullRomCurve3;
  object?: THREE.Object3D | THREE.Group | THREE.Mesh;
  t?: number;
  tt?: number;
  duration?: number;
  opacitySteps?: OpacityStep;
}
export type OpacityStep = {
  timeStart: number;
  timeEnd: number;
};
export interface OptionsSpotLight {
  name?: string;
  color?: THREE.ColorRepresentation | undefined;
  intensity?: number | undefined;
  distance?: number | undefined;
  angle?: number | undefined;
  penumbra?: number | undefined;
  decay?: number | undefined;
  position?: THREE.Vector3 | undefined;
  castShadow?: boolean | undefined;
  shadow?:
    | {
        mapSize?: THREE.Vector2 | undefined;
        bias?: number | undefined;
        radius?: number | undefined;
        camera?: {
          near: number | undefined;
          far: number | undefined;
          fov: number | undefined;
        };
      }
    | undefined;
}
