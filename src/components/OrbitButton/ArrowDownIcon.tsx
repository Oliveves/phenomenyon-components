import type { SVGProps } from "react"

export type ArrowDownIconProps = SVGProps<SVGSVGElement> & {
    size?: number | string
}

export default function ArrowDownIcon({
    size = 18,
    ...props
}: ArrowDownIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M12 5L12 19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
            />
        </svg>
    )
}
