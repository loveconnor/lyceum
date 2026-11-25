import {
  Bell as BellGlyph,
  Compass as CompassGlyph,
  EllipsisVertical as EllipsisVerticalGlyph,
  Heart as HeartGlyph,
  LayoutDashboard as LayoutDashboardGlyph,
  List as ListGlyph,
  LogOut as LogOutGlyph,
  Moon as MoonGlyph,
  Paintbrush as PaintbrushGlyph,
  PanelLeft as PanelLeftGlyph,
  Plus as PlusGlyph,
  Settings as SettingsGlyph,
  SlidersHorizontal as SlidersHorizontalGlyph,
  Sparkles as SparklesGlyph,
  Sun as SunGlyph,
  Trash2 as TrashGlyph,
  User as UserGlyph,
  type PlusProps,
} from "honestui/icons";

type AnimatedIconProps = PlusProps & {
  animate?: boolean;
  animateOnHover?: boolean;
};

function withHoverAnimation(Icon: typeof PlusGlyph) {
  return function AnimatedIcon({ animate, animateOnHover, ...props }: AnimatedIconProps) {
    return (
      <Icon
        data-icon-animate={animate || undefined}
        data-icon-animate-on-hover={animateOnHover || undefined}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const Bell = withHoverAnimation(BellGlyph);
export const Compass = withHoverAnimation(CompassGlyph);
export const EllipsisVertical = withHoverAnimation(EllipsisVerticalGlyph);
export const Heart = withHoverAnimation(HeartGlyph);
export const LayoutDashboard = withHoverAnimation(LayoutDashboardGlyph);
export const List = withHoverAnimation(ListGlyph);
export const LogOut = withHoverAnimation(LogOutGlyph);
export const Moon = withHoverAnimation(MoonGlyph);
export const Paintbrush = withHoverAnimation(PaintbrushGlyph);
export const PanelLeft = withHoverAnimation(PanelLeftGlyph);
export const Plus = withHoverAnimation(PlusGlyph);
export const Settings = withHoverAnimation(SettingsGlyph);
export const SlidersHorizontal = withHoverAnimation(SlidersHorizontalGlyph);
export const Sparkles = withHoverAnimation(SparklesGlyph);
export const Sun = withHoverAnimation(SunGlyph);
export const Trash2 = withHoverAnimation(TrashGlyph);
export const User = withHoverAnimation(UserGlyph);
