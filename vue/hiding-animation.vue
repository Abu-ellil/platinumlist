<template>
	<Transition
		:enterActiveClass="$style.enterActive"
		:enterFromClass="$style.enterFrom"
		:leaveActiveClass="$style.leaveActive"
		:leaveToClass="$style.leaveTo"
		@afterLeave="afterLeave"
		@beforeLeave="beforeLeave"
	>
		<slot></slot>
	</Transition>
</template>

<script setup>

import { defineEmits } from 'vue';

const emit = defineEmits(['beforeLeave', 'afterLeave']);

const beforeLeave = () => emit('beforeLeave');

const afterLeave = () => emit('afterLeave');

</script>

<style lang="scss" module>

.enterFrom {
	transform: translateX(20px);
	opacity: 0;
}

.enterActive {
	transition: all 0.3s ease-out;
}

.leaveActive {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.leaveTo {
	transform: translateX(20px);
	opacity: 0;
}

</style>