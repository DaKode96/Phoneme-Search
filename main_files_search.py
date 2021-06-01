import sqlite3
import os
import sys
import re

greek_search_info = \
    ("\n"
     "Single Phonemes:\n"
     "a:  α\n"
     "e:  ε\n"
     "ē:  η\n"
     "i:  ι\n"
     "o:  ο\n"
     "ō:  ω\n"
     "y:  υ\n"
     "u:  ου\n"
     "a:  ά\n"
     "e:  έ\n"
     "i:  ί\n"
     "o:  ό\n"
     "ō:  ώ\n"
     "y:  ύ\n"
     "u:  όυ\n"
     "ē:  ή\n"
     "i:  ι\n"
     "p:  π\n"
     "b:  β\n"
     "ph: φ\n"
     "t:  τ\n"
     "d:  δ\n"
     "th: θ\n"
     "k:  κ\n"
     "g:  γ\n"
     "kh: χ\n"
     "z:  ζ\n"
     "m:  μ\n"
     "n:  ν\n"
     "l:  λ\n"
     "r:  ρ\n"
     "s:  σ\n"
     "s:  ς\n"
     "ps: ψ\n"
     "p:  π\n"
     "b:  β\n"
     "ph: φ\n"
     "t:  τ\n"
     "d:  δ\n"
     "th: θ\n"
     "k:  κ\n"
     "g:  γ\n"
     "ks: ξ\n"
     "\n"
     "Phoneme classes:\n"
     "A: alveolar\n"
     "L: labial\n"
     "K: velar\n"
     "J: palatal\n"
     "G: laryngeal\n"
     "P: plosive\n"
     "R: approximant\n"
     "W: sonorant\n"
     "N: nasal\n"
     "F: fricative\n"
     ">: voiced\n"
     "#: aspirated\n"
     "<: voiceless\n"
     "%: not aspirated\n"
     "C: consonant\n"
     "V: vowel\n"
     "\n"
     "Wildcards:\n"
     "*: 0 or more characters\n"
     "|: marks end of lemma\n"
     "\n"
     "Input options:\n"
     "\n"
     "- 'a', 'b', 'kh', 'k': Lower case letters correspond to a single phoneme,\n"
     "  e.g.: 'a' = 'α', 'b' = 'β', 'kh' = 'χ', 'k' = 'κ' (full key above)\n"
     "\n"
     "- 'P+L+>', 'A': The capital letters correspond to phoneme classes (full key above). These classes \n"
     "  can be connected with '+', e.g. 'P+L+>' means plosive + labial + voiced.\n"
     "  You can choose one value of the features (manner, place, voice, aspiration) at the same time.\n"
     "  Thus, such connections could contain only up to four members, e.g. P+L+>+#.\n"
     "  'V' stands for vowel and C for consonant. These keys cannot be mixed with other ones.\n"
     "\n"
     "- '(abP+L)': If you want to allow a specific combination of phonemes at a certain place, you have to put\n"
     "   them in parenthesis. The same input rules as declared above apply within the brackets, too.\n")
vedic_search_info = \
    ("\n"
     "Key:\n"
     "\n"
     "Single phoneme input:\n"
     "The characters of the Latin transcription are used.\n"
     "\n"
     "Phoneme classes:\n"
     "A: alveolar\n"
     "L: labial\n"
     "K: velar\n"
     "J: palatal\n"
     "H: laryngeal\n"
     "X: retroflex\n"
     "P: plosive\n"
     "R: approximant\n"
     "W: glide\n"
     "N: nasal\n"
     "F: fricative\n"
     ">: voiced\n"
     "\"#: aspirated\"\n"
     "\"_: one_char\n"
     "<: voiceless\n"
     "%: non_aspirated\n"
     "V: vowel\n"
     "C: consonant\n"
     "\n"
     "Wildcards:\n"
     "*: 0 or more characters\n"
     "|: marks end of lemma\n"
     "\n"
     "Eingabemöglichkeiten:\n"
     "\n"
     "- 'a', 'b', 'kh', 'k': Lower case letters correspond to a single phoneme.\n"
     "\n"
     "- 'P+L+>', 'A': The capital letters correspond to phoneme classes (full key above). These classes \n"
     "  can be connected with '+', e.g. 'P+L+>' means plosive + labial + voiced.\n"
     "  You can choose one value of the features (manner, place, voice, aspiration) at the same time.\n"
     "  Thus, such connections could contain only up to four members, e.g. P+L+>+#.\n"
     "  'V' stands for vowel and 'C' for consonant. These keys cannot be mixed with other ones.\n"
     "\n"
     "- '(abP+L)': If you want to allow a specific combination of phonemes at a certain place, you have to put\n"
     "   them in parenthesis. The same input rules as declared above apply within the parenthesis, too.\n")
current_search_info = ""

# !!! Pay Attention: Program can't recognize the difference between 'ph', aspirated p and 'p''h', both single phonemes
# lists containing language specific information
path = ""
language = ""
consonants = []
vowels = []
digraphs = {}
ambiguous = {}


def mark_pattern(pattern, found):
    print(pattern)
    mark = []
    x = 0
    pattern = re.compile(pattern, re.UNICODE)
    for lemma in found:
        x += 1
        if x < 100:
            matches = pattern.finditer(lemma)
            for match in matches:
                print(match.groups(), lemma)
    
    #mark.sort(key=len)
    return(mark)


# function for sqlite3 to use regex
def regexp(expr, item):
    find = re.match(expr, item)
    return find is not None


def sql_fetch_entries(command) -> list:
    connection = sqlite3.connect(path)
    cursor = connection.cursor()
    cursor.execute(command)
    entries = cursor.fetchall()
    connection.close()
    return entries


def handle_digraphs(digraph, current_list, count) -> tuple[str, bool]:
    digraph_out = ""
    digraph_out += digraph
    is_digraph = False
    second = digraphs.get(digraph)
    for char in second:
        if current_list[count + 1] == char:
            is_digraph = True
            digraph_out += char
    return digraph_out, is_digraph


def handle_ambiguous_phonemes(ambiguous_char) -> str:
    ambiguous_out = ""
    ambiguous_out += ambiguous_char
    for char in ambiguous.get(ambiguous_char):
        ambiguous_out += "|" + char
    return ambiguous_out


# prepares check list for
def prepare_language_characteristics(language_index) -> list:
    global path
    global language
    global digraphs
    global ambiguous
    global current_search_info

    greek_digraphs = {"p": "hs", "k": "h", "t": "h"}
    vedic_digraphs = {"p": "h", "b": "h", "k": "h", "t": "h", "d": "h", "g": "h", "ṭ": "h", "ḍ": "h"}
    greek_ambiguous = {"σ": "ς", "α": "άᾶ", "ο": "ό", "ε": "έ", "η": "ή", "ι": "ῖί",
                       "ω": "ώῶ"}  # "ου": "όυ", "όυ": "ου"
    vedic_ambiguous = {}
    language_list = ["greek", "vedic", "latin"]
    language = language_list[language_index - 1]
    allowed = ["(", ")", "+"]

    if language == "greek":
        digraphs = greek_digraphs
        ambiguous = greek_ambiguous
        current_search_info = greek_search_info
    elif language == "vedic":
        digraphs = vedic_digraphs
        ambiguous = vedic_ambiguous
        current_search_info = vedic_search_info

    path = os.path.dirname(os.path.abspath(sys.argv[0]))  # muss angepasst werden an jeweilige Pfad-Gegebenheiten
    # path = os.path.dirname(os.path.dirname(path))
    path = os.path.join(path, r"database\PhonemeSearch.db")

    for kind in ["vowel", "consonant"]:
        kind_entries = sql_fetch_entries(command=f"SELECT grapheme FROM {language}_{kind}")
        if kind == "vowel":
            vowels.extend([grapheme[0] for grapheme in kind_entries])
        elif kind == "consonant":
            consonants.extend([grapheme[0] for grapheme in kind_entries])

    key_entries = sql_fetch_entries(command=f"SELECT key FROM search_key_{language}")
    allowed.extend([key[0] for key in key_entries])

    allowed.extend(vowels + consonants)
    print(allowed)
    return allowed


# checks if user string is a valid input
# returns False if there are syntax related problems
# returns True if there are no syntax related problems
def check_validity(search_string, allowed) -> bool:
    # check whether user str contains not allowed chars
    # check if there are probably misspelled blanks
    false_input = []
    aspirated_greek = ["k", "p", "t"]
    allowed_aspirated = []
    index = -1
    for char in search_string:
        index += 1
        if char == "h":
            if language == "greek":
                allowed_aspirated = aspirated_greek
                if search_string[index - 1] not in allowed_aspirated:
                    false_input.append("No allowed usage of 'h'!")
        elif char not in allowed:
            false_input.append(char)

    if len(false_input) > 0:
        return False
    else:
        return True


# simple search
def convert_string_to_list(search) -> list:
    group = ""
    grouped_list = []
    grouped = False
    for char in search:
        if char == "(":
            grouped = True
        elif char == ")":
            grouped = False
        else:
            group += char
        if grouped is False:
            grouped_list.append(group)
            group = ""
    grouped_list.append("fill")
    # print("grouped_list: ", grouped_list)
    return grouped_list


def connect_phoneme_groups(grouped_list) -> list:
    connect_list = []
    group_entry = ""
    index_count = -1
    is_digraph = False

    for group in grouped_list:
        index_count += 1
        if group == "fill":
            pass
        elif group == "+":
            group_entry += "+"
        elif is_digraph is True:
            is_digraph = False
        elif group == "*":
            connect_list.append(group)
        elif group == "|":
            connect_list.append(group)
        else:
            group_entry += group
            if grouped_list[index_count + 1] != "+":
                if group in digraphs:
                    digraph_return = \
                        handle_digraphs(digraph=group, current_list=grouped_list, count=index_count)
                    group_entry = digraph_return[0]
                    is_digraph = digraph_return[1]
                connect_list.append(group_entry)
                group_entry = ""
    # print("connect_list: ", connect_list)
    return connect_list


def convert_to_non_latin_alphabet(search) -> list:
    outer_group = []
    for grapheme in search:
        inner_group = []
        for latin_graph in grapheme:
            if latin_graph in ["\\w*", "$"]:
                inner_group.append(latin_graph)
                continue

            translit_sql_cmd = \
                f"SELECT grapheme_{language} FROM {language}_consonant WHERE grapheme = '{latin_graph}'"

            greek_graph = sql_fetch_entries(command=translit_sql_cmd)
            if len(greek_graph) == 0:
                translit_sql_cmd = \
                    f"SELECT grapheme_{language} FROM {language}_vowel WHERE grapheme = '{latin_graph}'"
                greek_graph = sql_fetch_entries(command=translit_sql_cmd)

            greek_graph = greek_graph[0]
            inner_group.append(greek_graph[0])
        outer_group.append(inner_group)
    search = outer_group
    return search


def convert_key_to_grapheme(connected) -> list:
    search = []
    group = []
    select_phonemes_cmd = f"SELECT grapheme FROM {language}_consonant WHERE "
    is_digraph = False
    for phoneme in connected:
        phoneme_index = -1
        length = len(phoneme) - 1
        for char in phoneme:
            phoneme_index += 1
            if is_digraph is True:
                is_digraph = False
            elif char in consonants or char in vowels:
                if phoneme_index == length:
                    pass
                elif char in digraphs:
                    digraph_return = \
                        handle_digraphs(digraph=char, current_list=phoneme, count=phoneme_index)

                    char = digraph_return[0]
                    is_digraph = digraph_return[1]
                group.append(char)
            else:
                if char == "+":
                    select_phonemes_cmd += " AND "
                elif char == "V":
                    for vow in vowels:
                        group.append(vow)
                elif char == "C":
                    for con in consonants:
                        group.append(con)
                elif char == "*":
                    group.append("\\w*")
                elif char == "|":
                    group.append("$")
                else:
                    try:
                        if phoneme[phoneme_index + 1] == "+":
                            plus_true = True
                        else:
                            plus_true = False
                    except IndexError:
                        plus_true = False
                    select_value_kind_cmd = f"SELECT value, kind FROM search_key_{language} " \
                                            f"WHERE key = '{char}'"
                    value_kind = sql_fetch_entries(command=select_value_kind_cmd)
                    value_kind = value_kind[0]  # verbessern! unverständlich
                    current_value = value_kind[0]
                    current_kind = value_kind[1]
                    select_phonemes_cmd += f"{current_kind} = '{current_value}'"

                    if plus_true is False:
                        phonemes = sql_fetch_entries(command=select_phonemes_cmd)
                        for x in phonemes:
                            group.append(x[0])
                        select_phonemes_cmd = f"SELECT grapheme FROM {language}_consonant WHERE "

        group = list(set(group))
        search.append(group)
        group = []

    if language in ["greek"]:
        search = convert_to_non_latin_alphabet(search=search)
    return search


# uses regex
def phoneme_search(grapheme_string) -> tuple[list, str, str]:
    pattern = ""
    for grapheme in grapheme_string:
        if "\\" in grapheme:
            pattern += grapheme
        elif len(grapheme) > 1:
            count = 0
            pattern += "("
            for char in grapheme:
                count += 1
                if char in ambiguous:
                    pattern += handle_ambiguous_phonemes(ambiguous_char=char)
                elif char == "ου":
                    pattern += "ου|όυ|ού"  # verallgemeinern
                else:
                    pattern += char
                if len(grapheme) > count:
                    pattern += "|"
            pattern += ")"
        else:
            if grapheme[0] in ambiguous:
                amb_grapheme = "("
                amb_grapheme += handle_ambiguous_phonemes(ambiguous_char=grapheme[0])
                amb_grapheme += ")"
                grapheme = amb_grapheme
            elif grapheme[0] == "ου":
                grapheme = "(ου|όυ|ού)"
            pattern += "".join(grapheme)

    user_pattern = re.sub("\\\w\*", "*", pattern)
    #print("search pattern:", user_pattern)
    # print("regex pattern:", pattern)
    search_command = f"SELECT lemma FROM {language} WHERE lemma REGEXP '{pattern}'"
    connection = sqlite3.connect(path)
    cursor = connection.cursor()
    connection.create_function("REGEXP", 2, regexp)
    cursor.execute(search_command)
    results = cursor.fetchall()
    connection.close()

    index = -1
    for result in results:
        index += 1
        results[index] = result[0]
    connection.close()
    return results, user_pattern, pattern


def save_result(results, pattern) -> str:
    file_name = ""
    already_exists = True
    global path
    save_path = path.removesuffix("\\database\\PhonemeSearch.db")
    while already_exists:
        try:
            file_name = input("Please set a file name.\n"
                              "input: ")
            open(save_path + f"\\saved searches\\{language}\\{file_name}.txt", "r", encoding="utf-8")
            overwrite = input("File already exists. Do you want to overwrite it?\n"
                              "1) yes\n"
                              "any key) no\n")
            if overwrite == "1":
                already_exists = False
        except FileNotFoundError:
            already_exists = False

    file = open(save_path + f"\\saved searches\\{language}\\{file_name}.txt", "w", encoding="utf-8")
    file.write("\n".join(results))
    file.write("\n\nnumber of results: " + str(len(results)))
    file.write("\nsearch pattern: " + pattern)
    print(f"Search saved as {file_name}.txt.")
    return f"Search saved as {file_name}.txt."


def connect_search_related_fcts(search_string) -> tuple[list, str]:
    in_list = (convert_string_to_list(search=search_string))
    connected_list = connect_phoneme_groups(in_list)
    grapheme_list = convert_key_to_grapheme(connected=connected_list)
    results = phoneme_search(grapheme_string=grapheme_list)
    return results


# user gives search, decides whether to save it or not
# has to be strictly separated from other functions to make further work (server) easier -> only simple
# use of functions
# only used in local version
def main_menu():
    user_string = []
    user_input_check = False
    allowed = []
    while user_input_check is False:
        user_language = input("In which language would you like to search?"
                              "\n"
                              "1) Greek"
                              "\n"
                              "2) Vedic"
                              "\n"
                              "input: ")
        if user_language in ["1", "2"]:
            user_language = int(user_language)
            user_input_check = True
            allowed = prepare_language_characteristics(language_index=user_language)
        else:
            print("\nFalse input. Please try again.\n")

    user_input_check = False
    false_input = ""
    while user_input_check is False:
        if false_input:
            print(false_input)
        print(current_search_info)
        user_string = input("Look for input options and search key above."
                            "\n"
                            "input: ")
        check = check_validity(search_string=user_string, allowed=allowed)
        # calls check_validity function which checks user string
        # if check_validity returns None: not handled
        if check is True:
            user_input_check = True
        else:
            false_input = "\nWrong input. Please try again.\n"
            user_input_check = False

    res_pat = connect_search_related_fcts(search_string=user_string)
    testMark = mark_pattern(pattern=res_pat[2], found=res_pat[0])
    print("result: ", res_pat[0])
    print("number of lemmata found: ", len(res_pat[0]))
    save_input = input("Do you want to save your search in a txt-File?\n"
                       "1) yes\n"
                       "any key) no\n")
    if save_input == "1":
        save_result(results=res_pat[0], pattern=res_pat[1])


if __name__ == "__main__":
    new_search = True
    while new_search:
        main_menu()
        user_new_search = input("Another search?\n"
                                "1) yes\n"
                                "any key) no\n")
        if user_new_search == "1":
            new_search = True
        else:
            new_search = False
