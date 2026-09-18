import { defineField, defineType } from "sanity";
import { PresetManager } from "../../components/PresetManager";

export default defineType({
  name: "presetManager",
  title: "Theme presets",
  type: "object",
  components: { input: PresetManager },
  fields: [
    defineField({ name: "_placeholder", title: "Placeholder", type: "string", hidden: true }),
  ],
});
