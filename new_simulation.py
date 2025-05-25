"""シミュレーションのテンプレートから、新しいシミュレーションを作成するスクリプト"""

import re
import shutil


def get_input(prompt, error_message, validation_func):
    """ユーザーからの入力を取得し、検証します。"""
    while True:
        user_input = input(prompt)
        if validation_func(user_input):
            return user_input
        print()
        print("################# ERROR ###########################")
        print(f"Error: {error_message}")
        print("##################################################")
        print()


def main():
    """新しいシミュレーションを作成します。"""
    replace_list = {"title": "", "path": ""}
    template_path = "template"
    base_path = "vite/simulations/"
    p = re.compile("[a-zA-Z0-9_-]*")

    title = get_input(
        "シミュレーションのタイトルを日本語で入力してください：",
        "入力してください。",
        lambda x: x != "",
    )
    replace_list["title"] = title

    dir_name = get_input(
        "シミュレーションのフォルダ名を半角英数字およびハイフン（-）で入力してください：",
        "英数字およびハイフンで入力してください。",
        lambda x: p.fullmatch(x) and x != "",
    )

    path = base_path + dir_name
    replace_list["path"] = "/simulations/" + dir_name

    shutil.copytree(template_path, path)

    with open(path + "/index.html", "r", encoding="utf-8") as file:
        html = file.read()

    for key, value in replace_list.items():
        html = html.replace("{% " + key + " %}", value)

    with open(path + "/index.html", "w", encoding="utf-8") as file:
        file.write(html)

    print(f"{base_path}に「{title}」のフォルダ「{dir_name}」を生成しました。")
    print()


if __name__ == "__main__":
    main()
