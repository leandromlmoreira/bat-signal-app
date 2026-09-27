import { StyleSheet } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { BAT_BOX, BAT_PATH } from "./Icons.tsx";
import { colors } from "../theme/tokens.ts";

const WIDTH = 640;
const HEIGHT = 560;
const SIGNAL = { x: 505, y: 142, r: 80 };
const LAMP = { x: 125, y: 442 };

interface Building {
  x: number;
  width: number;
  height: number;
}

const BUILDINGS: Building[] = [
  { x: 0, width: 58, height: 150 },
  { x: 54, width: 40, height: 210 },
  { x: 90, width: 70, height: 118 },
  { x: 156, width: 46, height: 176 },
  { x: 198, width: 64, height: 250 },
  { x: 258, width: 38, height: 140 },
  { x: 292, width: 76, height: 196 },
  { x: 364, width: 44, height: 280 },
  { x: 404, width: 62, height: 162 },
  { x: 462, width: 50, height: 226 },
  { x: 508, width: 72, height: 134 },
  { x: 576, width: 64, height: 188 },
];

const STARS = [
  [42, 60, 1.2], [118, 34, 0.9], [210, 88, 1.1], [262, 30, 0.8], [318, 72, 1],
  [380, 26, 0.9], [610, 40, 1.1], [620, 250, 0.8], [36, 190, 0.9], [250, 170, 0.7],
] as const;

function windowsFor(building: Building, index: number) {
  const rows = Math.floor((building.height - 30) / 18);
  const cols = Math.max(1, Math.floor((building.width - 12) / 12));
  const lit: { x: number; y: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if ((row * 5 + col * 3 + index * 7) % 11 === 0) {
        lit.push({ x: building.x + 8 + col * 12, y: HEIGHT - building.height + 16 + row * 18 });
      }
    }
  }
  return lit;
}

function beamPath() {
  const spread = SIGNAL.r * 0.98;
  const dx = SIGNAL.x - LAMP.x;
  const dy = SIGNAL.y - LAMP.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  return `M${LAMP.x - 4} ${LAMP.y} L${SIGNAL.x + nx * spread} ${SIGNAL.y + ny * spread} L${SIGNAL.x - nx * spread} ${SIGNAL.y - ny * spread} L${LAMP.x + 4} ${LAMP.y} Z`;
}

function lampPath() {
  return `M${LAMP.x - 9} ${LAMP.y + 6} L${LAMP.x - 5} ${LAMP.y - 3} L${LAMP.x + 5} ${LAMP.y - 6} L${LAMP.x + 9} ${LAMP.y + 6} Z`;
}

export function SignalScene({ anchor = "center" }: { anchor?: "center" | "right" }) {
  const batScale = (SIGNAL.r * 1.56) / BAT_BOX.width;
  const batX = SIGNAL.x - (BAT_BOX.x + BAT_BOX.width / 2) * batScale;
  const batY = SIGNAL.y - (BAT_BOX.y + BAT_BOX.height / 2) * batScale;
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio={anchor === "right" ? "xMaxYMin slice" : "xMidYMid slice"}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#070913" />
          <Stop offset="0.55" stopColor="#0C1122" />
          <Stop offset="1" stopColor="#1A2034" />
        </LinearGradient>
        <LinearGradient id="beam" x1={LAMP.x} y1={LAMP.y} x2={SIGNAL.x} y2={SIGNAL.y} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.signal} stopOpacity="0.5" />
          <Stop offset="1" stopColor={colors.signal} stopOpacity="0.06" />
        </LinearGradient>
        <RadialGradient id="disc" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFE9A8" />
          <Stop offset="0.7" stopColor={colors.signal} />
          <Stop offset="1" stopColor={colors.signalDeep} />
        </RadialGradient>
        <RadialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={colors.signal} stopOpacity="0.3" />
          <Stop offset="1" stopColor={colors.signal} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={WIDTH} height={HEIGHT} fill="url(#sky)" />
      {STARS.map(([x, y, r]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.4} />
      ))}
      <Path d={beamPath()} fill="url(#beam)" />
      <Circle cx={SIGNAL.x} cy={SIGNAL.y} r={SIGNAL.r * 2.1} fill="url(#halo)" />
      <Circle cx={SIGNAL.x} cy={SIGNAL.y} r={SIGNAL.r} fill="url(#disc)" opacity={0.95} />
      <G transform={`translate(${batX} ${batY}) scale(${batScale})`}>
        <Path d={BAT_PATH} fill={colors.ink} opacity={0.92} />
      </G>
      {BUILDINGS.map((building, index) => (
        <G key={building.x}>
          <Rect x={building.x} y={HEIGHT - building.height} width={building.width} height={building.height} fill="#05060A" />
          {windowsFor(building, index).map((light) => (
            <Rect key={`${light.x}-${light.y}`} x={light.x} y={light.y} width={4} height={6} fill={colors.signal} opacity={0.4} />
          ))}
        </G>
      ))}
      <Path d={lampPath()} fill="#262B3B" />
      <Circle cx={LAMP.x} cy={LAMP.y - 3} r={3.5} fill="#FFF2C4" />
    </Svg>
  );
}
