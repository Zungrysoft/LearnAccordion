# Script for quickly inserting new words into the randomizer without duplicating any values

import json

FILE_PATH = '../src/data/randomizer_words.json'
TYPES = ["weapons","nouns","descriptions","adjectives","names","emphases"]
WEAPON_TYPES = [
	"trinket",
	"sword",
	"axe",
	"pickaxe",
	"shovel",
	"hoe",
	"armor",
	"helmet",
	"chestplate",
	"leggings",
	"boots",
	"shield",
	"bow",
	"crossbow",
	"trident",
	"wings",
	"potion",
	"staff",
]

def data_insert(value, plural_form, weight, list):
	# Make sure it's not already in the list
	for i in range(len(list)):
		if list[i]["value"] == value:
			prev_weight = list[i]["weight"]
			print(f"Entry already in list. Updating weight from {prev_weight}.")
			list[i]["weight"] = weight
			list[i]["value_plural"] = plural_form
			return list
	
	# Build data
	ins = {"value": value, "weight": weight}
	
	# Check for plural form
	if plural_form != "":
		ins["value_plural"] = plural_form
	
	list.append(ins)
	return list

def init_data(data):
	for type in TYPES:
		if type == "weapons":
			if not type in data:
				data[type] = {}
			for weapon in WEAPON_TYPES:
				if not weapon in data[type]:
					data[type][weapon] = []
		else:
			if not type in data:
				data[type] = []
	return data

def main():
	data = {}
	with open(FILE_PATH,"r") as f:
		data = json.load(f)
		data = init_data(data)
		while(True):
			# Value input
			value = input("Input the word (or type \"done\"): ")
			
			# Terminate on done
			if value == "done":
				break
			
			# Weight input
			try:
				weight = int(input("Input weight: "))
			except:
				print("Invalid input")
				continue
			if weight <= 0:
				print("Invalid input")
				continue
			
			# Type input
			print(f"1: {value} of Destruction")
			print(f"2: Sword of the {value}s")
			print(f"3: Sword of {value}")
			print(f"4: Sword that's {value}")
			print(f"5: {value}'s Sword")
			print(f"6: {value} Very Bad Sword")
			type = input("Input type: ")
			
			# Check for plural form
			plural_form = ""
			if type == "*2" or type == "2*":
				type = 2
				plural_form = input("Plural Form: ")
			
			# Input verification
			try:
				type = int(type) - 1
			except:
				print("Invalid input")
				continue
			if type < 0 or type >= len(TYPES):
				print("Invalid input")
				continue
			
			# Insert data
			# Special case for weapons
			if type == 0:
				# Weapon type input
				for i in range(len(WEAPON_TYPES)):
					print(f"{i+1}: {WEAPON_TYPES[i]}")
				
				# Input verification
				try:
					weapon = int(input("Weapon type: ")) - 1
				except:
					print("Invalid input")
					continue
				if weapon < 0 or weapon >= len(WEAPON_TYPES):
					print("Invalid input")
					continue
				
				# Insert data
				data[TYPES[type]][WEAPON_TYPES[weapon]] = data_insert(value, "", weight, data[TYPES[type]][WEAPON_TYPES[weapon]])
			# All other keys
			else:
				# Insert data
				data[TYPES[type]] = data_insert(value, plural_form, weight, data[TYPES[type]])
				
	# Write resulting json data to file
	with open(FILE_PATH,"w") as f:
		json.dump(data, f)
	print("Wrote to json file!")

main()

