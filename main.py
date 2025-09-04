import random
import time
import os

def create_grid(height: int, width: int) -> list:
    grid = [[random.choice([0, 1]) for _ in range(width)] for _ in range(height)]
    return grid

def check_neighbors(grid: list[list[int]], r: int, c: int) -> int:
    counter = 0

    for row_offset in [-1, 0, 1]:
        for col_offset in [-1, 0, 1]:

            neighbor_r = r + row_offset
            neighbor_c = c + col_offset

            if row_offset == 0 and col_offset == 0:
                continue

            if neighbor_r < 0 or neighbor_r >= len(grid):
                continue

            if neighbor_c < 0 or neighbor_c >= len(grid[0]):
                continue

            if grid[neighbor_r][neighbor_c] > 0:
                counter += 1

    return counter

def get_next_state(is_alive: int, neighbor_count: int) -> int:
    if is_alive == 1:
        if neighbor_count == 2 or neighbor_count == 3:
            return 1
    else:
        if neighbor_count == 3:
            return 1
    return 0
        
def get_next_grid(current_grid: list[list[int]]) -> list[list[int]]:
    height = len(current_grid)
    width = len(current_grid[0])
    next_grid = [[0 for _ in range(width)] for _ in range(height)]
    
    for r in range(len(current_grid)):
        for c in range(len(current_grid[0])):
            next_grid[r][c] = get_next_state(current_grid[r][c], check_neighbors(current_grid, r, c))

    return next_grid

def print_grid(grid: list[list[int]]) -> None:
    for r in range(len(grid)):
        line = ""
        for c in range(len(grid[0])):
            if grid[r][c] == 1:
                line += "■"
            else:
                line += " "
        print(line)

def clear_console():
    if os.name == 'nt':  # For Windows
        _ = os.system('cls')
    else:  # For macOS and Linux
        _ = os.system('clear')

if __name__ == "__main__":
    GRID_HEIGHT = 100
    GRID_WIDTH = 100
    world = create_grid(GRID_HEIGHT, GRID_WIDTH)

    for _ in range(100):
        world = get_next_grid(world)
        print_grid(world)
        time.sleep(0.2)
        clear_console()
