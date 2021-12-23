<template>
  <v-container class="mainContainer">
    <div class="learning">
      <h1>{{ $t("learningTitle") }}</h1>
    </div>
    <div>{{ $t("federated_simulation") }}</div>
    <br />
    <b-row>
      <b-col lg="5" md="8" offset="1">
        <b-row>
          <v-card class="learningContainer">
            <div class="panelTitle">
              <span>{{ $t("prepareRequestTxt") }}</span>
            </div>

            <div class="preparePanel">
              <div class="prepare">
                <b-form-group id="learningPrepareBodyForm">
                  <b-form-textarea
                    id="learningPrepareBodyTextArea"
                    size="sm"
                    v-model="prepareBody"
                    rows="20"
                  ></b-form-textarea>
                </b-form-group>
                <b-button block variant="success" @click="getPrepare">{{
                  $t("sendPrepareTxt")
                }}
                <span v-if="isPreparing">(loading)</span></b-button>
              </div>
            </div>
          </v-card>
        </b-row>

        <b-row v-if="showTrainInput">
          <v-card class="learningContainer">
            <div class="panelTitle">
              <span>{{ $t("TrainRequestTxt") }}</span>
            </div>

            <div class="preparePanel">
              <div class="train">
                <b-form-group id="learningTrainBodyForm">
                  <b-form-textarea
                    id="learningTrainBodyTextArea"
                    size="sm"
                    v-model="trainBody"
                    rows="3"
                  ></b-form-textarea>
                </b-form-group>
                <b-button
                  block
                  variant="success"
                  @click="getTrain"
                  :disabled="isTrainButtonDisabled"
                  >{{ $t("sendTrainTxt") }}
                    <span v-if="isTraining">(loading)</span>
                  </b-button>
              </div>
            </div>
          </v-card>
        </b-row>
        <b-row v-if="evaluateCompleted">
          <v-card class="resultContainer">
            <div class="panelTitle">
              <span>{{ $t("evaluateResultTxt") }}</span>
            </div>
            <div>
              <b-table striped hover :items="evaluateResult"></b-table>
            </div>
          </v-card>
        </b-row>
      </b-col>
      <b-col lg="4" md="4" offset="1" v-if="!inProgress">
        <b-card class="sitesCard">
          <b-card-header class="cardHeader text-center">{{
            $t("activeConnectionsTxt")
          }}</b-card-header>
          <b-card-body class="sitesCardBody">
            <b-form-group>
              <b-form-checkbox
                class="sites-checkbox"
                v-model="selectedSites"
                v-for="availableSite in availableSites"
                :options="availableSite.uid"
                :key="availableSite.uid"
                :value="availableSite.uid"
              >
                <strong
                  >{{ availableSite.uid }} - {{ availableSite.name }}</strong
                >
              </b-form-checkbox>
            </b-form-group>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col lg="5" md="8" offset="1" v-if="inProgress">
        <b-row v-for="metric in metrics" :key="metric.name">
          <b-overlay
            :show="showGraphLoading"
            spinner-variant="primary"
            spinner-type="grow"
            rounded="sm"
            class="metricsPanel"
          >
            <b-card class="metricsCard text-center">
              <b-card-header class="cardHeader">{{
                metric.name
              }}</b-card-header>
              <b-card-body class="metricsCardBody">
                <LearningLineChart
                  :dataToPlot="metric"
                  :data="progressResult"
                ></LearningLineChart>
              </b-card-body>
            </b-card>
          </b-overlay>
        </b-row>
      </b-col>
    </b-row>
  </v-container>
</template>

<script>
import LearningApi from "@/api/LearningApi";
import SiteApi from "@/api/SiteApi";
import LearningLineChart from "../components/LearningLineChart.vue";
export default {
  components: { LearningLineChart },
  name: "Learning",
  methods: {
    getPrepare() {
      const sitesUri = this.selectedSites.join(",");
      this.isPreparing = true;

      console.log(sitesUri);
      LearningApi.getPrepare(this.prepareBody, sitesUri)
        .then((res) => res.data)
        .then((json) => json.job)
        .then((job) => {
            this.jobID = job;
            this.trainBody = `{"job": "${job}","rounds": 50}`
            this.isPreparing = false;
          })
          .catch((error) => {
            this.isPreparing = false;
          });
      this.isTrainButtonDisabled = false;
      this.showTrainInput = true;
      
    },
    getTrain() {
      this.progressResult = [];
      this.isTrainButtonDisabled = true;
      this.isTraining = true;

      this.getProgress();
      this.progressInterval = setInterval(() => {
        this.getProgress();
      }, 2000);
      const sitesUri = this.selectedSites.join(",");
      LearningApi.getTrain(this.trainBody, sitesUri).then((res) => {
        clearInterval(this.progressInterval);
        this.getProgress();
        this.getEvaluate();
        this.isTraining = false;
      })
      .catch((error) => {
        this.isTraining = false;
      });
    },
    getProgress() {
      const sitesUri = this.selectedSites.join(",");
      LearningApi.getProgress(this.progressBody, sitesUri)
        .then((res) => res.data)
        .then((json) => {
          this.progressResult = json;
          this.inProgress = true;
          if (this.progressResult.length != 0) this.showGraphLoading = false;
        });
    },
    getEvaluate() {
      const sitesUri = this.selectedSites.join(",");

      LearningApi.getEvaluate(this.evaluateBody, sitesUri)
        .then((res) =>{
          this.evaluateCompleted = true;
          this.evaluateResult = res.data;
        })
    }
  },
  async created() {
    await SiteApi.get()
      .then((res) => res.data)
      .then((json) => json.connections)
      .then((conn) => {
        this.availableSites = conn;
        conn.forEach(conn => {
          this.selectedSites.push(conn.uid)
        });
      });
  },
  data() {
    return {
      trainBody: '',
      selectedSites: [],
      availableSites: [],
      showGraphLoading: true,
      showTrainInput: false,
      isTrainButtonDisabled: false,
      inProgress: false,
      isPreparing: false,
      isTraining: false,
      evaluateCompleted: false,
      metrics: [
        { name: "Accuracy", value: "acc" },
        { name: "Loss", value: "loss" },
        { name: "Validation Accuracy", value: "val_acc" },
        { name: "Validation Loss", value: "val_loss" },
      ],
      progressInterval: null,
      progressResult: [],
      evaluateResult: [],
      jobID: "",
      prepareBody: `{
        "selectors": [
          {
            "resource": "Patient",
            "filters": [
            ],
            "fields": [
              {
                "path":"gender",
                "label": "gender"
              },
              {
                "path":"age",
                "label":"age"
              },
              {
                "path":"isDeceased",
                "label":"isDeceased"
              }
            ],
            "joins": {
              "resource": "Observation",
              "filters": [
                {
                  "path": "code.coding.code",
                  "operator": "is",
                  "value": "718-7"
                }
              ],
              "fields": [
                {
                  "path":"value.Quantity.value",
                  "label": "hemoglobin"
                }
              ]
            }
          }
        ],
        "options": {
          "model": {
            "class_name": "Sequential",
            "config": {
              "name": "sequential_1",
              "layers": [
                  "etc..."
              ]
            }
          },
          "inputs": [
            "gender",
            "age",
            "hemoglobin"
          ],
          "outputs": [
            "isDeceased"
          ],
          "optimizer": {
            "name": "adam",
            "parameters": {
              "learning_rate": 0.00025,
              "validation_split": 0.33,
              "evaluation_split": 0.2,
              "epochs": 1,
              "batch_size": 20,
              "shuffle": 1000
            }
          },
          "compiler": {
            "parameters": {
              "loss": "binaryCrossentropy",
              "metrics": [
                "accuracy"
              ]
            }
          }
        }
      }`,
    };
  },
  computed: {
    progressBody: function() {
      return `{"job": "${this.jobID}"}`;
    },
    evaluateBody: function() {
      return `{"job": "${this.jobID}"}`;
    }
  },
};
</script>

<style scoped></style>
