# Installing a Write.as template

These steps work for every template in this repository. Each template's own guide lists its settings.

## Before you start

- **Write.as Pro.** Custom CSS and JavaScript are Pro features.
- **A blog address of its own.** In **Customize → Preferred URL**, choose `yourblog.writeas.com` or a custom domain. Write.as only runs custom JavaScript there, so on `write.as/yourblog` the CSS works but the JavaScript features don't appear.

## Steps

1. **Download the template.** Open its folder in the [gallery](README.md) and use the download link at the top of its guide. Unzip it.
2. **Open your blog's settings:** Write.as → **Blogs** → your blog → **Customize**.
3. **CSS:** open the template's `.css` file in any text editor, copy all of it, and paste it into **Custom CSS**, replacing anything already there.
4. **JavaScript:** do the same with the `.js` file and **Custom JavaScript**.
5. **Settings:** edit the settings block at the top of the JavaScript (and the colour block at the top of the CSS if you like). At minimum, set `BLOG_ALIAS` to your blog's short name, the part after `write.as/` in its address.
6. **Save changes**, then open your blog in a private window to see it as readers do.

## If something looks wrong

| What you see | Why, and the fix |
|---|---|
| The CSS works but menus, numbers or side panels are missing | The JavaScript isn't running. Check the blog uses its own address (see above) and that the whole `.js` file was pasted. |
| Code text shows on the page | Part of the file was pasted into the wrong box. Paste the `.css` file only into Custom CSS and the `.js` file only into Custom JavaScript. |
| Old styling still shows | Your browser cached the old version. Reload with ⌘ Cmd + Shift + R (Mac) or Ctrl + Shift + R (Windows). |
| Quotes look curly and the theme breaks | A word processor changed `"` into `“ ”`. Copy from a plain text editor or straight from GitHub instead. |
| Pages are numbered or listed wrongly | `BLOG_ALIAS` doesn't match your blog. Copy it exactly from your blog's write.as address. |

## Switching back

To return to Write.as's default look, clear both the Custom CSS and Custom JavaScript boxes and save.
