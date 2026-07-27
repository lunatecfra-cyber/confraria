import Image from "next/image";

type LogoProps = {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export function Logo({ className, alt = "Confraria", style }: LogoProps) {
  return (
    <Image
      src="/emblema.png"
      alt={alt}
      width={365}
      height={365}
      className={className}
      style={style}
      draggable={false}
      priority
    />
  );
}
