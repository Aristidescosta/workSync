import {
	Button as ChakraButton,
	Icon,
	ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface ButtonProps extends ChakraButtonProps {
	variant: "primary" | "secondary" | "info" | "outline" | "link" | "ghost";
	iconLeft?: IconType;
	iconRight?: IconType;
}

export function ZentaakButton({
	children,
	variant,
	iconLeft,
	iconRight,
	...rest
}: ButtonProps) {
	const getHoverStyles = () => {
		switch (variant) {
			case "primary":
				return {
					_hover: {
						opacity: 0.9,
					},
				};
			case "info":
				return {
					_hover: {
						opacity: 0.9,
					},
				};
			case "secondary":
				return {
					_hover: {
						opacity: 0.9,
					},
				};
			case "outline":
				return {
					_hover: {
						bg: "white",
					},
				};
			case "ghost":
				return {
					_hover: {
						bg: "#FAFAFA",
					},
				};
			default:
				return {};
		}
	};

	return (
		<ChakraButton variant={variant} {...getHoverStyles()} {...rest}>
			{iconLeft && <Icon as={iconLeft} mr={2} />}
			{children}
			{iconRight && <Icon as={iconRight} ml={2} />}
		</ChakraButton>
	);
}
