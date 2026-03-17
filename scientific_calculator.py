import tkinter as tk
from tkinter import font
import math

class ScientificCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Scientific Calculator")
        self.root.geometry("500x700")
        self.root.minsize(400, 600)
        self.root.resizable(True, True)
        
        # Red dark theme colors
        self.bg_dark = "#1a0f0f"
        self.bg_button = "#2d1515"
        self.bg_button_hover = "#3d2020"
        self.fg_text = "#ff6b6b"
        self.fg_text_light = "#ffb3b3"
        self.accent_red = "#cc3333"
        self.display_bg = "#0d0808"
        
        self.root.configure(bg=self.bg_dark)
        
        self.expression = ""
        self.previous_result = ""
        
        self.setup_ui()
        
    def setup_ui(self):
        # Display frame
        display_frame = tk.Frame(self.root, bg=self.bg_dark)
        display_frame.pack(fill=tk.BOTH, expand=False, padx=10, pady=10)
        
        # Display label
        self.display = tk.Label(
            display_frame,
            text="0",
            font=("Arial", 24, "bold"),
            bg=self.display_bg,
            fg=self.fg_text,
            anchor="e",
            padx=15,
            pady=20,
            relief=tk.SUNKEN,
            bd=2
        )
        self.display.pack(fill=tk.BOTH, expand=True, ipady=10)
        
        # Main button frame
        main_frame = tk.Frame(self.root, bg=self.bg_dark)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        # Configure grid weights for responsiveness
        for i in range(8):
            main_frame.grid_rowconfigure(i, weight=1)
        for i in range(5):
            main_frame.grid_columnconfigure(i, weight=1)
        
        # Button layout
        buttons = [
            # Row 0 - Functions
            [("sin", self.on_sin), ("cos", self.on_cos), ("tan", self.on_tan), ("π", self.on_pi), ("C", self.on_clear)],
            # Row 1 - More functions
            [("log", self.on_log), ("ln", self.on_ln), ("√", self.on_sqrt), ("x²", self.on_square), ("⌫", self.on_backspace)],
            # Row 2 - Numbers and operations
            [("7", lambda: self.on_number(7)), ("8", lambda: self.on_number(8)), ("9", lambda: self.on_number(9)), ("÷", self.on_divide), ("(", self.on_left_paren)],
            # Row 3
            [("4", lambda: self.on_number(4)), ("5", lambda: self.on_number(5)), ("6", lambda: self.on_number(6)), ("×", self.on_multiply), (")", self.on_right_paren)],
            # Row 4
            [("1", lambda: self.on_number(1)), ("2", lambda: self.on_number(2)), ("3", lambda: self.on_number(3)), ("-", self.on_minus), ("e", self.on_e)],
            # Row 5
            [("0", lambda: self.on_number(0)), (".", self.on_dot), ("1/x", self.on_inverse), ("+", self.on_plus), ("^", self.on_power)],
            # Row 6 - Equals
            [("=", self.on_equals)],
        ]
        
        for row_idx, row in enumerate(buttons):
            for col_idx, (text, command) in enumerate(row):
                self.create_button(main_frame, text, command, row_idx, col_idx, len(row))
    
    def create_button(self, parent, text, command, row, col, cols_in_row):
        # Determine button appearance based on type
        if text == "=":
            bg = self.accent_red
            fg = "white"
            columnspan = cols_in_row
        elif text in ["C", "⌫"]:
            bg = self.accent_red
            fg = "white"
            columnspan = 1
        elif text in ["+", "-", "×", "÷", "^", "(", ")"]:
            bg = self.bg_button_hover
            fg = self.fg_text_light
            columnspan = 1
        else:
            bg = self.bg_button
            fg = self.fg_text
            columnspan = 1
        
        button = tk.Button(
            parent,
            text=text,
            command=command,
            font=("Arial", 12, "bold"),
            bg=bg,
            fg=fg,
            activebackground=self.bg_button_hover,
            activeforeground=self.fg_text_light,
            relief=tk.FLAT,
            bd=0,
            padx=10,
            pady=10,
            cursor="hand2"
        )
        button.grid(row=row, column=col, columnspan=columnspan, sticky="nsew", padx=2, pady=2)
    
    def update_display(self, value=""):
        if value == "":
            self.display.config(text=self.expression or "0")
        else:
            self.display.config(text=value)
    
    def on_number(self, num):
        self.expression += str(num)
        self.update_display()
    
    def on_dot(self):
        if "." not in self.expression.split()[-1]:
            self.expression += "."
            self.update_display()
    
    def on_plus(self):
        if self.expression and self.expression[-1] not in "+-×÷^":
            self.expression += "+"
            self.update_display()
    
    def on_minus(self):
        if self.expression and self.expression[-1] not in "+-×÷^":
            self.expression += "-"
            self.update_display()
    
    def on_multiply(self):
        if self.expression and self.expression[-1] not in "+-×÷^":
            self.expression += "*"
            self.update_display()
    
    def on_divide(self):
        if self.expression and self.expression[-1] not in "+-×÷^":
            self.expression += "/"
            self.update_display()
    
    def on_power(self):
        if self.expression and self.expression[-1] not in "+-×÷^":
            self.expression += "**"
            self.update_display()
    
    def on_left_paren(self):
        self.expression += "("
        self.update_display()
    
    def on_right_paren(self):
        self.expression += ")"
        self.update_display()
    
    def on_sqrt(self):
        if self.expression:
            try:
                result = math.sqrt(float(eval(self.expression)))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_square(self):
        if self.expression:
            try:
                result = float(eval(self.expression)) ** 2
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_inverse(self):
        if self.expression:
            try:
                result = 1 / float(eval(self.expression))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_sin(self):
        if self.expression:
            try:
                result = math.sin(math.radians(float(eval(self.expression))))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_cos(self):
        if self.expression:
            try:
                result = math.cos(math.radians(float(eval(self.expression))))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_tan(self):
        if self.expression:
            try:
                result = math.tan(math.radians(float(eval(self.expression))))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_log(self):
        if self.expression:
            try:
                result = math.log10(float(eval(self.expression)))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_ln(self):
        if self.expression:
            try:
                result = math.log(float(eval(self.expression)))
                self.expression = str(result)
                self.update_display()
            except:
                self.display.config(text="Error")
    
    def on_pi(self):
        self.expression += str(math.pi)
        self.update_display()
    
    def on_e(self):
        self.expression += str(math.e)
        self.update_display()
    
    def on_clear(self):
        self.expression = ""
        self.update_display()
    
    def on_backspace(self):
        self.expression = self.expression[:-1]
        self.update_display()
    
    def on_equals(self):
        try:
            # Replace symbols with Python equivalents
            expr = self.expression.replace("×", "*").replace("÷", "/")
            result = eval(expr)
            self.previous_result = str(result)
            self.expression = str(result)
            self.update_display()
        except:
            self.display.config(text="Error")
            self.expression = ""


if __name__ == "__main__":
    root = tk.Tk()
    calc = ScientificCalculator(root)
    root.mainloop()
