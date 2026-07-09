import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  type Theme = "light" | "dark" | "system";
  
  interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
  }
  
  const ThemeContext = createContext<ThemeContextType>(
    {} as ThemeContextType
  );
  
  export const ThemeProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [theme, setTheme] = useState<Theme>(() => {
      return (
        (localStorage.getItem("theme") as Theme) ||
        "system"
      );
    });
  
    const [resolvedTheme, setResolvedTheme] =
      useState<"light" | "dark">("light");
  
    useEffect(() => {
      const media = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
  
      const update = () => {
        const current =
          theme === "system"
            ? media.matches
              ? "dark"
              : "light"
            : theme;
  
        setResolvedTheme(current);
  
        document.documentElement.classList.remove(
          "light",
          "dark"
        );
  
        document.documentElement.classList.add(current);
      };
  
      update();
  
      media.addEventListener("change", update);
  
      return () =>
        media.removeEventListener("change", update);
    }, [theme]);
  
    useEffect(() => {
      localStorage.setItem("theme", theme);
    }, [theme]);
  
    return (
      <ThemeContext.Provider
        value={{
          theme,
          resolvedTheme,
          setTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useTheme = () =>
    useContext(ThemeContext);