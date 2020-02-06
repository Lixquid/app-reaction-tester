<template lang="pug">
    .container.my-5.mx-auto
        h1
            | Reaction Tester
            |
            a.btn.btn-outline-primary.float-right(href="https://lixquid.com").
                lixquid.com

        button.btn.btn-lg.w-100.mt-5(
            v-on:click.passive="mainPress"
            :class="button[1]"
        ) {{button[0]}}

        .custom-control.custom-switch.mt-5
            input.custom-control-input#settings--audio(
                type="checkbox"
                v-model="settings.audio"
            )
            label.custom-control-label(for="settings--audio")
                | Audio Alert

        .card.mt-5
            .card-header
                | Times
                a.float-right.text-danger(
                    href="#"
                    v-on:click.prevent="data.times = []"
                ) Clear Times
            .card-body
                ol
                    li(v-for="(t, i) in data.times", :key="i") {{t}}ms
                span(v-if="data.times.length")
                    | Average: {{timesAverage}}ms
</template>

<script lang="ts">
import { createComponent, ref, computed } from "@vue/composition-api";
import alertData from "./alert";
import useLocalStorageRef from "./useLocalStorageRef";

enum Stage {
    Ready,
    WaitForIt,
    PressMe,
    TooSoon
}

export default createComponent({
    setup() {
        const data = ref({
            stage: Stage.Ready,
            activeTime: 0,
            timeoutId: null as number | null,

            times: [] as number[]
        });
        const settings = useLocalStorageRef("settings", {
            audio: true
        });

        const a = new Audio(alertData);
        function mainPress(): void {
            switch (data.value.stage) {
                case Stage.Ready:
                case Stage.TooSoon:
                    // Start the timer
                    data.value.timeoutId = setTimeout(() => {
                        data.value.stage = Stage.PressMe;
                        if (settings.value.audio) {
                            a.play();
                        }
                        data.value.activeTime = Date.now();
                    }, Math.random() * 2000 + 1000);
                    data.value.stage = Stage.WaitForIt;
                    return;
                case Stage.WaitForIt:
                    // Too soon
                    data.value.stage = Stage.TooSoon;
                    if (data.value.timeoutId) {
                        clearTimeout(data.value.timeoutId);
                    }
                    return;
                case Stage.PressMe:
                    // Good reaction!
                    data.value.stage = Stage.Ready;
                    if (data.value.timeoutId) {
                        clearTimeout(data.value.timeoutId);
                    }
                    data.value.times.push(Date.now() - data.value.activeTime);
                    return;
            }
        }

        const button = computed<[string, string]>(() => {
            switch (data.value.stage) {
                case Stage.Ready:
                    return ["Click to Start", "btn-primary"];
                case Stage.WaitForIt:
                    return ["Wait for it...", "btn-secondary"];
                case Stage.PressMe:
                    return ["Press me!", "btn-success"];
                case Stage.TooSoon:
                    return ["Too soon! Click to try again", "btn-primary"];
            }
        });

        const timesAverage = computed(() =>
            Math.floor(
                data.value.times.reduce((p, c) => p + c, 0) /
                    data.value.times.length
            )
        );

        return { data, settings, mainPress, timesAverage, button };
    }
});
</script>
