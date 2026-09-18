"use client";

import { useCallback, useState } from "react";
import { Button, Card, Flex, Select, Stack, Text, TextInput } from "@sanity/ui";
import { set, unset } from "sanity";
import { useClient, useFormValue } from "sanity";
import type { ObjectInputProps } from "sanity";
import { DEFAULT_THEME } from "../schemaTypes/documents/siteStyle";

export function PresetManager(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const docId = useFormValue(["_id"]) as string;
  const presets = (useFormValue(["presets"]) as any[]) || [];
  const [newName, setNewName] = useState("");
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);

  const realId = docId?.replace(/^drafts\./, "");

  const applyColorsFonts = useCallback(
    async (colors: any, fonts: any) => {
      setBusy(true);
      try {
        await client
          .patch(docId || realId)
          .set({ colors, fonts })
          .commit({ autoGenerateArrayKeys: true });
      } finally {
        setBusy(false);
      }
    },
    [client, docId, realId]
  );

  const saveAsPreset = useCallback(async () => {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const current = (await client.getDocument(docId || realId)) as any;
      const preset = {
        _type: "themePreset",
        _key: `${Date.now()}`,
        name: newName.trim(),
        colors: current?.colors,
        fonts: current?.fonts,
      };
      await client
        .patch(docId || realId)
        .setIfMissing({ presets: [] })
        .append("presets", [preset])
        .commit({ autoGenerateArrayKeys: true });
      setNewName("");
    } finally {
      setBusy(false);
    }
  }, [client, docId, realId, newName]);

  const switchToPreset = useCallback(async () => {
    const preset = presets.find((p) => p._key === selected);
    if (!preset) return;
    await applyColorsFonts(preset.colors, preset.fonts);
  }, [presets, selected, applyColorsFonts]);

  const resetToOriginal = useCallback(async () => {
    await applyColorsFonts(DEFAULT_THEME.colors, DEFAULT_THEME.fonts);
  }, [applyColorsFonts]);

  return (
    <Card padding={3} radius={2} shadow={1} tone="transparent">
      <Stack space={4}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Save current colours + fonts as a preset
          </Text>
          <Flex gap={2}>
            <TextInput
              placeholder="e.g. Midnight Editorial"
              value={newName}
              onChange={(e) => setNewName(e.currentTarget.value)}
            />
            <Button text="Save preset" tone="positive" disabled={busy || !newName.trim()} onClick={saveAsPreset} />
          </Flex>
        </Stack>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Switch to a saved preset
          </Text>
          <Flex gap={2}>
            <Select value={selected} onChange={(e) => setSelected(e.currentTarget.value)}>
              <option value="">Choose a preset…</option>
              {presets.map((p) => (
                <option key={p._key} value={p._key}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Button text="Apply" disabled={busy || !selected} onClick={switchToPreset} />
          </Flex>
        </Stack>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Reset to original
          </Text>
          <Button text="Reset to Cherry Editorial" tone="critical" mode="ghost" disabled={busy} onClick={resetToOriginal} />
        </Stack>
      </Stack>
    </Card>
  );
}
