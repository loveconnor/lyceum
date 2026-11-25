import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from "honestui/icons"

export const toastIcons = {
  success: <CircleCheck aria-hidden="true" size={16} />,
  info: <Info aria-hidden="true" size={16} />,
  warning: <TriangleAlert aria-hidden="true" size={16} />,
  error: <CircleAlert aria-hidden="true" size={16} />,
  loading: <LoaderCircle aria-hidden="true" size={16} className="motion-safe:animate-spin" />,
  close: <X aria-hidden="true" size={12} />,
}
